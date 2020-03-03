import Papa from "papaparse";
import { performanceData } from "./performanceData";
import { performanceTableData, releaseSummaryData } from "./realeaseTableData";

export const dataPoint = (version, benchmark, params, value, date) => ({
  version,
  group: "Cypher",
  benchmark,
  params,
  mode: "LATENCY",
  value,
  date
});

const parseParams = params =>
  params
    .split("_")
    .slice(1)
    .join(" ")
    .replace(",", " ");

export const toDataPoint = ([
  version,
  group,
  benchmark,
  params,
  mode,
  value,
  unit,
  date
]) => ({
  version,
  group,
  benchmark,
  params: parseParams(params),
  mode,
  value: parseFloat(value),
  unit,
  date: parseInt(date)
});

export const createInitState = () => {
  return {
    oldVersion: "old",
    newVersion: "new",
    fetchingData: false,
    rawdata: [],
    perfData: [],
    performanceTable: [],
    colapsed: {},
    screen: "fetching-data"
  };
};

const setAllColapsedTo = (val, { perfData }) => {
  var colapsed = perfData.reduce(
    (agg, it) => ({ ...agg, [it.benchmark]: val }),
    {}
  );
  var performanceTable = performanceTableData(perfData, colapsed);
  return { colapsed, performanceTable };
};

const toggleTableElement = (name, r) => {
  const { colapsed, perfData } = r;
  var colapsedWithTogled = { ...colapsed, [name]: !colapsed[name] };
  var performanceTable = performanceTableData(perfData, colapsedWithTogled);
  return {
    performanceTable,
    colapsed: colapsedWithTogled
  };
};

const downloadCsv = (...args) =>
  new Promise((resolve, reject) => {
    Papa.parse(...args, {
      download: true,
      complete: function({ data, errors, meta }) {
        if (errors.length > 0) reject(errors);
        resolve(data);
      }
    });
  });

const skipHeader = data => {
  let [_, ...rest] = data;
  return rest;
};

export const fetchDataRequest = dispatch => {
  Promise.all([downloadCsv("/data-old.csv"), downloadCsv("/data-new.csv")])
    .then(([oldResult, newResult]) => {
      let oldVersion = oldResult[1][0];
      let newVersion = newResult[1][0];
      let data = [...skipHeader(oldResult), ...skipHeader(newResult)].map(
        toDataPoint
      );
      dispatch({ type: "FETCH_DATA_SUCCESS", data, oldVersion, newVersion });
    })
    .catch(error => {
      console.error("Error when fetching data:", error);
      alert("downloading failed. please refresh page");
    });
};

const lineChartData = (element, state) => {
  let { benchmark, params } = element;
  let { rawdata, oldVersion, newVersion } = state;

  return {
    lineChart: [
      {
        values: rawdata
          .filter(d => d.benchmark === benchmark)
          .filter(d => d.params === params)
          .filter(d => d.version === oldVersion)
          .sort((x, y) => x.date - y.date)
          .map(d => ({
            date: d.date,
            value: d.value,
            params: d.params
          }))
      },
      {
        values: rawdata
          .filter(d => d.benchmark === benchmark)
          .filter(d => d.params === params)
          .filter(d => d.version === newVersion)
          .sort((x, y) => x.date - y.date)
          .map(d => ({
            date: d.date,
            value: d.value,
            params: d.params
          }))
      }
    ]
  };
};

const fetchDataSuccess = ({ oldVersion, newVersion, data }, { colapsed }) => {
  let perfData = performanceData(data, oldVersion, newVersion);
  let performanceTable = performanceTableData(perfData, colapsed);
  let releaseSummary = releaseSummaryData(perfData);

  return {
    rawdata: data,
    perfData,
    performanceTable,
    releaseSummary,
    lineChart: []
  };
};

export const rootReducer = (state = createInitState(), action) => {
  switch (action.type) {
    case "FETCH_DATA_REQUEST":
      return { ...state };

    case "FETCH_DATA_SUCCESS":
      return {
        ...state,
        ...fetchDataSuccess(action, state),
        screen: "release-summary"
      };

    case "TOGGLE":
      return { ...state, ...toggleTableElement(action.element, state) };

    case "EXPAND_ALL":
      return { ...state, ...setAllColapsedTo(false, state) };

    case "COLLAPSE_ALL":
      return { ...state, ...setAllColapsedTo(true, state) };

    case "SHOW_SCREEN":
      return { ...state, screen: action.screen };

    case "SHOW_LINE_CHART":
      return {
        ...state,
        ...lineChartData(action.element, state),
        selectedElement: action.element
      };

    default:
      return state;
  }
};
