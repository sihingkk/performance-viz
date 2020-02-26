import { dataPoint, performanceData, perfPoint, rootReducer, createInitState } from "./reducers"


const findBy = (coll,benchmark, params) => coll.find((it) => it.benchmark == benchmark && it.params == params)
const findByName = (coll,name) => coll.find((it)=> it.name == name)

test('use the latest data for performance table', () => {
    // given
    let points = [dataPoint("1.0.0", "benchmark 1", "param1", 101, 1),
    dataPoint("1.0.0", "benchmark 1", "param1", 100, 2),
    dataPoint("1.0.1", "benchmark 1", "param1", 102, 3),
    dataPoint("1.0.1", "benchmark 1", "param1", 103, 4)]
    //when
    let result = performanceData(points,"1.0.0","1.0.1")
    //then    
    expect(findBy(result,"benchmark 1", "param1")).toMatchObject({
        benchmark:"benchmark 1",params:"param1", oldValue:100, newValue:103        
    })
    expect(result[0].change).toBeCloseTo(-0.03, 3)
})

test('returns values for every combination of benchmark and params', () => {
    // given
    let points = [dataPoint("1.0.0", "benchmark 1", "param1", 100, 1),
        dataPoint("1.0.0", "benchmark 1", "param2", 100, 2),
        dataPoint("1.0.0", "benchmark 2", "param1", 100, 3),
        dataPoint("1.0.2", "benchmark 1", "param1", 100, 1),
        dataPoint("1.0.2", "benchmark 1", "param2", 100, 2),
        dataPoint("1.0.2", "benchmark 2", "param1", 100, 3),
    ]
    //when
    let result = performanceData(points,"1.0.0","1.0.2")
    //then
    expect(result.length).toEqual(3)
    expect(findBy(result,"benchmark 1", "param2")).toMatchObject({
        benchmark:"benchmark 1",params:"param2", oldValue:100, newValue:100        
    })
})

const perfPointFixture = (data) => 
    ({...perfPoint('sample benchmark','sample param',1,2,1), ...data})

test('toggle toggles element of table after init', () => {
    // given
    let state = {colapsed: {}, 
        perfData: [ 
            perfPointFixture({benchmark:'sample 1'}),
            perfPointFixture({benchmark:'sample 2'})
        ]};
    let action = {type: 'TOGGLE', element: 'sample 1'};
    
    //when
    let {performanceTable} = rootReducer(state, action);

    //then
    let sample1 = findByName(performanceTable, 'sample 1')    
    expect(sample1.colapsed).toEqual(true)

    let sample2 = findByName(performanceTable, 'sample 2')
    expect(sample2.colapsed).toEqual(false)
})

test('toggle already colapsed element', () => {
    // given
    let state = {colapsed: {'sample 1': true}, 
        perfData: [ 
            perfPointFixture({benchmark:'sample 1'}),
            perfPointFixture({benchmark:'sample 2'})
        ]};
    let action = {type: 'TOGGLE', element: 'sample 1'};
    
    //when
    let {performanceTable} = rootReducer(state, action);

    //then
    let sample1 = findByName(performanceTable, 'sample 1')    
    expect(sample1.colapsed).toEqual(false)

    let sample2 = findByName(performanceTable, 'sample 2')
    expect(sample2.colapsed).toEqual(false)
})

test('expand all elements', () => {
    // given
    let state = {colapsed: {'sample 1': true}, 
    perfData: [ 
        perfPointFixture({benchmark:'sample 1'}),
        perfPointFixture({benchmark:'sample 2'})
    ]};
    let action = {type: 'EXPAND_ALL'};

    //when
    let {performanceTable} = rootReducer(state, action);

    //then
    let sample1 = findByName(performanceTable, 'sample 1')    
    expect(sample1.colapsed).toEqual(false)

    let sample2 = findByName(performanceTable, 'sample 2')
    expect(sample2.colapsed).toEqual(false)
})

test('expand all elements', () => {
    // given
    let state = {colapsed: {'sample 1': true}, 
    perfData: [ 
        perfPointFixture({benchmark:'sample 1'}),
        perfPointFixture({benchmark:'sample 2'})
    ]};
    let action = {type: 'COLLAPSE_ALL'};

    //when
    let {performanceTable} = rootReducer(state, action);

    //then
    let sample1 = findByName(performanceTable, 'sample 1')    
    expect(sample1.colapsed).toEqual(true)

    let sample2 = findByName(performanceTable, 'sample 2')
    expect(sample2.colapsed).toEqual(true)
})