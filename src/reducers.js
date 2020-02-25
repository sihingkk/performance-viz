export const dataPoint = (version,benchmark, params, mean, date) =>
({
    version: version,
    group: "Cypher",
    benchmark: benchmark,
    params: params,
    mode: "LATENCY",
    value: mean,
    date: date
})

export const perfPoint = (benchmark,params, oldValue, newValue, change) => ({benchmark,params,oldValue,newValue,change})

const change = (oldValue, newValue) => -(newValue-oldValue)/oldValue;

export const performanceData = (data,oldVersion,newVersion) => {    
    let grouped = data.reduce((agg,x) => {        
        let key = [x.benchmark,x.params]
        if (!agg.hasOwnProperty(key)) {
            agg[key] = [];
        }
       agg[key].push(x)
       return agg
    },{})
    
    return Object.values(grouped).map((data) =>  {
        let sorted = data.sort((x,y) => y.date-x.date)
        let oldVal = sorted.find(x => x.version === oldVersion);    
        let newVal = sorted.find(x => x.version === newVersion);
        return perfPoint(oldVal.benchmark, 
            oldVal.params, 
            oldVal.value, 
            newVal.value,
            change(oldVal.value,newVal.value))
        }
    );
}

const performanceTableData = (data, colapsedItems) => {
    let grouped = data.reduce((agg,x) => {        
        let key = [x.benchmark]
        if (!agg.hasOwnProperty(key)) {
            agg[key] = [];
        }
       agg[key].push(x)
       return agg
    },{})

    return Object.values(grouped).map((data) =>  {
        let {benchmark} = data[0];
        let avgChange = data.map(it => it.change).reduce((a,b) => a+b) / data.length
        let items = data.map(it=> ({name: it.params, oldValue: it.oldValue,newValue: it.newValue,change: it.change}))
        let colapsed = colapsedItems[benchmark]
        let grouped = {name: benchmark, change: avgChange, type: 'grouped', colapsed}
        return colapsed ? [grouped] : [grouped, ...items].flat()    
    }).flat();
}


const initialState = {
    oldVersion: "old",
    newVersion: "new", 
    rawdata: [dataPoint("old","IndexScan.executePlan", "(propertyType,long)(runtime,interpreted)",12.8918264082474,1580833090210),
        dataPoint("old","IndexScan.executePlan", "(propertyType,long)(runtime,interpreted)",13.1281222103237,1580766830318),
        dataPoint("old","IndexScan.executePlan", "(propertyType,long)(runtime,interpreted)",13.2180848805917,1580739379847),
        dataPoint("old","IndexScan.executePlan", "(propertyType,long)(runtime,interpreted)",12.9616675359116,1580375605806),
        dataPoint("old","IndexScan.executePlan", "(propertyType,long)(runtime,interpreted)",12.9616675359116,1580375605806),        
        dataPoint("old","IndexScan.executePlan", "(propertyType,long)(runtime,interpreted)",13.2180848805917,1580739379847),
        dataPoint("new","IndexScan.executePlan", "(propertyType,long)(runtime,interpreted)",13.2180848805917,1580739379847)
    ],
    data: [],
    performanceTable: [],
    colapsed: {}
}

function createInitState() {
    let {rawdata, oldVersion, newVersion} = initialState;
    let perfData = performanceData(rawdata, oldVersion, newVersion)
    let perfTableData = performanceTableData(perfData, {})
    return {...initialState,        
        data: perfData,        
        colapsed: {},                    
        performanceTable: perfTableData}}

export const rootReducer = (state = createInitState(), action) => {
    switch (action.type) {
        case 'TOGGLE':         
            var {colapsed,data} = state
            var performanceTable = performanceTableData(data,colapsed)            
            return {...state, 
                performanceTable,
                colapsed: {...colapsed, [action.element]: !colapsed[action.element]}}
        case 'EXPAND_ALL':        
            var colapsed = {}
            var {data} = state
            var performanceTable = performanceTableData(data,colapsed)
            return {...state, colapsed, performanceTable}
        case 'COLLAPSE_ALL':        
            var colapsed = state.performanceTable.reduce((agg, it) => agg[it.name] = true,{})
            var {data} = state
            var performanceTable = performanceTableData(data,colapsed)
            return {...state, colapsed, performanceTable}
       default:
            return state
    }
}
