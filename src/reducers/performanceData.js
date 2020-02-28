import { groupBy } from "./utils";

const mean = xs => xs.reduce((agg, x) => agg + x) / xs.length;

const variance = xs => {
  let m = mean(xs);
  return (
    xs.reduce(function(agg, x) {
      agg = agg + Math.pow(x - m, 2);
      return agg;
    }, 0) / xs.length
  );
};

const std = xs => Math.sqrt(variance(xs));

const change = (oldValue, newValue) => -(newValue - oldValue) / oldValue;

export const performanceData = (data, oldVersion, newVersion) => {
  let grouped = groupBy(data, x => [x.benchmark, x.params]);
  return Object.values(grouped).map(data => {
    let sorted = data.sort((x, y) => y.date - x.date);
    let oldVal = sorted.find(x => x.version === oldVersion);
    let newVal = sorted.find(x => x.version === newVersion);

    let oldVals = sorted.filter(x => x.version === oldVersion);
    let newVals = sorted.filter(x => x.version === newVersion);

    return {
      benchmark: oldVal.benchmark,
      params: oldVal.params,
      oldValue: oldVal.value,
      newValue: newVal.value,
      change: change(oldVal.value, newVal.value),
      oldVariance: variance(oldVals.map(it => it.value)),
      newVariance: variance(newVals.map(it => it.value)),
      oldMean: mean(oldVals.map(it => it.value)),
      newMean: mean(newVals.map(it => it.value)),
      oldStd: std(oldVals.map(it => it.value)),
      newStd: std(newVals.map(it => it.value)),
      values: oldVals.map(x => x.value)
    };
  });
};
