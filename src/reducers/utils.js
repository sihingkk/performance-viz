export const groupBy = (coll, f) =>
    coll.reduce((agg,x) => {        
        let key = f(x)
        if (!agg.hasOwnProperty(key)) {
            agg[key] = [];
        }
        agg[key].push(x)
        return agg
    },{})

