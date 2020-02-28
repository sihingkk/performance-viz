export const groupBy = (coll, f) =>
  coll.reduce((agg, x) => {
    let key = f(x);
    if (!agg.hasOwnProperty(key)) {
      agg[key] = [];
    }
    agg[key].push(x);
    return agg;
  }, {});

Object.defineProperty(Array.prototype, "flat", {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  }
});
