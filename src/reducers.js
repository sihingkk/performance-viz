import Papa from 'papaparse';

export const dataPoint = (version,benchmark, params, value, date) =>
({
    version,
    group: "Cypher",
    benchmark,
    params,
    mode: "LATENCY",
    value,
    date
})

const parseParams = (params) => params.split('_').slice(1).join(" ").replace(","," ")

export const toDataPoint = ([version,group,benchmark, params, mode, value, unit, date]) =>
({version, group, benchmark, params: parseParams(params), mode, value: parseFloat(value), unit, date: parseInt(date)})


export const perfPoint = (benchmark,params, oldValue, newValue, change) => ({benchmark,params,oldValue,newValue,change})

const change = (oldValue, newValue) => -(newValue-oldValue)/oldValue;

const groupBy = (coll, f) =>
    coll.reduce((agg,x) => {        
        let key = f(x)
        if (!agg.hasOwnProperty(key)) {
            agg[key] = [];
        }
        agg[key].push(x)
        return agg
    },{})

export const performanceData = (data,oldVersion,newVersion) => {    
    let grouped = groupBy(data, (x=>[x.benchmark,x.params]));
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

const groupedItem = (name, changes, colapsed) => ({
    name,
    change: changes.reduce((a,b) => a+b) / changes.length,
    type: 'grouped',
    colapsed
})

const toTableItem = ({params,oldValue,newValue,change}) => 
    ({oldValue,newValue,change, name: params})

const performanceTableData = (data, colapsedItems) => {    
    let grouped = groupBy(data, (x=>x.benchmark));    
    return Object.values(grouped).map((xs) =>  {
        let [{benchmark}] = xs
        let colapsed = !!colapsedItems[benchmark]
        let grouped = groupedItem(
            benchmark, 
            xs.map(it => it.change), 
            colapsed)
        return colapsed 
                ? [grouped] 
                : [grouped, ...xs.map(toTableItem)].flat()    
    }).flat();
}

const initialState = {
    oldVersion: "old",
    newVersion: "new",
    fetchingData: false, 
    rawdata: [],
    perfData: [],
    performanceTable: [],
    colapsed: {}
}

export const createInitState = () => {
    return initialState
}

const setAllColapsedTo = (val, {perfData}) => {
    var colapsed = perfData.reduce((agg, it) => ({...agg, [it.benchmark]: val}),{})    
    var performanceTable = performanceTableData(perfData,colapsed)
    return {colapsed, performanceTable}
}

const toggleTableElement = (name, r) => {
    const {colapsed,perfData}  = r
    console.log({r})
    var colapsedWithTogled = {...colapsed, [name]: !colapsed[name]}
    
    var performanceTable = performanceTableData(perfData,colapsedWithTogled)
    console.log({performanceTable})
    return {performanceTable,
            colapsed: colapsedWithTogled}
}

const downloadCsv = (...args) => new Promise((resolve, reject) => {
            Papa.parse(...args, {
                download: true,
                complete: function({data,errors,meta}) {   
                    if(errors.length > 0) reject(errors)
                    resolve(data)
                }
            });          
        })

const skipHeader = (data) => {
    let [first, ...rest] = data
    return rest 
}

export const fetchDataRequest = (dispatch) => {
    Promise.all([
        downloadCsv("/data-old.csv"),
        downloadCsv("/data-new.csv")
    ]).then(([oldResult, newResult]) => {    
        let oldVersion = oldResult[1][0]
        let newVersion = newResult[1][0]
        let data = [...skipHeader(oldResult), ...skipHeader(newResult)].map(toDataPoint)        
        dispatch({type:'FETCH_DATA_SUCCESS', data, oldVersion, newVersion})
    }).catch(error => {
        console.error("Error when fetching data:",error)
        alert('downloading failed. please refresh page')
    })
}


export const rootReducer = (state = createInitState(), action) => {
    console.log(action)
    switch (action.type) {
        case 'FETCH_DATA_REQUEST':
            return {...state, fetchingData: true}

        case 'FETCH_DATA_SUCCESS':
            
            let {oldVersion, newVersion, data} = action;
            let rawdata = data;
            console.log("rawdata", rawdata.length)
            let perfData = performanceData(rawdata, oldVersion, newVersion)           
            console.log("perfData", perfData.length)
            let performanceTable = performanceTableData(perfData, state.colapsed)            
            console.log("performanceTable", performanceTable.length)
            return {...state, rawdata, perfData, performanceTable, fetchingData: false}

        case 'TOGGLE':                     
            return {...state, ...toggleTableElement(action.element, state)}

        case 'EXPAND_ALL':        
            return {...state, ...setAllColapsedTo(false, state)};

        case 'COLLAPSE_ALL':        
            return {...state, ...setAllColapsedTo(true, state)};

       default:
            return state
    }
}
