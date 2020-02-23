
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

export const perfTablePoint = (benchmark,params, oldValue, newValue, change) => ({benchmark,params,oldValue,newValue,change})

const change = (oldValue, newValue) => -(newValue-oldValue)/oldValue;

export const performanceTableData = (data,oldVersion,newVersion) => {    
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
        return perfTablePoint(oldVal.benchmark, 
            oldVal.params, 
            oldVal.value, 
            newVal.value,
            change(oldVal.value,newVal.value))
        }
    );
}

const initialState = {
    oldVersion: "old",
    newVersion: "new", 
    data: [dataPoint("old","IndexScan.executePlan", ["(propertyType,long)","(runtime,interpreted)"],12.8918264082474,1580833090210),
        dataPoint("old","IndexScan.executePlan", ["(propertyType,long)","(runtime,interpreted)"],13.1281222103237,1580766830318),
        dataPoint("old","IndexScan.executePlan", ["(propertyType,long)","(runtime,interpreted)"],13.2180848805917,1580739379847),
        dataPoint("old","IndexScan.executePlan", ["(propertyType,long)","(runtime,interpreted)"],12.9616675359116,1580375605806),
        dataPoint("old","IndexScan.executePlan", ["(propertyType,long)","(runtime,interpreted)"],12.9616675359116,1580375605806),        
        dataPoint("old","IndexScan.executePlan", ["(propertyType,long)","(runtime,interpreted)"],13.2180848805917,1580739379847),
        dataPoint("new","IndexScan.executePlan", ["(propertyType,long)","(runtime,interpreted)"],13.2180848805917,1580739379847)
    ],
    ui: {
        performanceTable: {
            data: []
        }

    }
}

function createInitState() {
    let {data, oldVersion, newVersion} = initialState;
    return {...initialState, ui: {
        performanceTable: {
            data: performanceTableData(data, oldVersion, newVersion)
        }}}}

export const rootReducer = (state = createInitState(), action) => {
    switch (action.type) {
       default:
            return state
    }
}
