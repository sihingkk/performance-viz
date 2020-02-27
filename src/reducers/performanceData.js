import { groupBy } from './utils'

export const perfPoint = (benchmark,params, oldValue, newValue, change, oldVariance, newVariance) => 
({benchmark,params,oldValue,newValue,change, oldVariance, newVariance})

const mean = (xs) =>
    xs.reduce((agg, x) => agg+x) / xs.length

const variance = (xs) => {
    let m = mean(xs)
    return xs.reduce(function(agg, x) {
            agg = agg + Math.pow((x - m), 2);
            return agg;
        }, 0) /xs.length
}

const change = (oldValue, newValue) => -(newValue-oldValue)/oldValue;


export const performanceData = (data,oldVersion,newVersion) => {    
    let grouped = groupBy(data, (x=>[x.benchmark,x.params]));
    return Object.values(grouped).map((data) =>  {
        let sorted = data.sort((x,y) => y.date-x.date)
        let oldVal = sorted.find(x => x.version === oldVersion);    
        let newVal = sorted.find(x => x.version === newVersion);           
        
        let oldVals = sorted.filter(x => x.version === oldVersion);    
        let newVals = sorted.filter(x => x.version === newVersion);           

        return perfPoint(oldVal.benchmark, 
            oldVal.params, 
            oldVal.value, 
            newVal.value,
            change(oldVal.value, newVal.value),
            variance(oldVals.map(it=> it.value)),
            variance(newVals.map(it=> it.value)))
        }
    );
}
