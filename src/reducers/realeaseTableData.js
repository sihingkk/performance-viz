import { groupBy } from "./utils";

export const changeStatus = ({ oldMean, oldStd, newValue, change }) => {
  let rangeFrom = oldMean - 2 * oldStd;
  let rangeTo = oldMean + 2 * oldStd;
  let newValueInRange = newValue >= rangeFrom && rangeTo >= newValue;
  return newValueInRange
    ? "neutral-change"
    : change > 0
    ? "positive-change"
    : "negative-change";
};

const toTableItem = perfData => {
  let { params } = perfData;
  let status = changeStatus(perfData);
  return { name: params, ...perfData, status };
};

export const performanceTableData = (data, colapsedItems) => {
  let grouped = groupBy(data, x => x.benchmark);
  return Object.values(grouped)
    .map(xs => {
      let tableItems = xs.map(toTableItem);
      let [{ benchmark }] = xs;
      let colapsed = !!colapsedItems[benchmark];
      let minChange = tableItems.reduce((a, b) =>
        b.change > a.change ? a : b
      );
      let maxChange = tableItems.reduce((a, b) =>
        a.change > b.change ? a : b
      );
      let grouped = {
        name: benchmark,
        minChange: minChange.change,
        minStatus: minChange.status,
        maxChange: maxChange.change,
        maxStatus: maxChange.status,
        colapsed,
        type: "grouped"
      };
      return colapsed ? [grouped] : [grouped, ...xs.map(toTableItem)].flat();
    })
    .flat();
};

export const releaseSummaryData = data => {
  return data.map(toTableItem).filter(it => it.status === "negative-change");
};
