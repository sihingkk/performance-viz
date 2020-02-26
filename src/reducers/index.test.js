import { rootReducer } from "."
import {perfPoint} from './performanceData'


const findByName = (coll,name) => coll.find((it)=> it.name == name)


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