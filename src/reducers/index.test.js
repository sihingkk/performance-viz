import { rootReducer, dataPoint } from ".";

const findByName = (coll, name) => coll.find(it => it.name == name);
const perfPoint = (
  benchmark,
  params,
  oldValue,
  newValue,
  change,
  oldVariance,
  newVariance,
  oldMean,
  newMean,
  oldStd,
  newStd
) => ({
  benchmark,
  params,
  oldValue,
  newValue,
  change,
  oldVariance,
  newVariance,
  oldMean,
  newMean,
  oldStd,
  newStd
});
const perfPointFixture = data => ({
  ...perfPoint("sample benchmark", "sample param", 1, 2, 1),
  ...data
});

test("toggle toggles element of table after init", () => {
  // given
  let state = {
    colapsed: {},
    perfData: [
      perfPointFixture({ benchmark: "sample 1" }),
      perfPointFixture({ benchmark: "sample 2" })
    ]
  };
  let action = { type: "TOGGLE", element: "sample 1" };

  //when
  let { performanceTable } = rootReducer(state, action);

  //then
  let sample1 = findByName(performanceTable, "sample 1");
  expect(sample1.colapsed).toEqual(true);

  let sample2 = findByName(performanceTable, "sample 2");
  expect(sample2.colapsed).toEqual(false);
});

test("toggle already colapsed element", () => {
  // given
  let state = {
    colapsed: { "sample 1": true },
    perfData: [
      perfPointFixture({ benchmark: "sample 1" }),
      perfPointFixture({ benchmark: "sample 2" })
    ]
  };
  let action = { type: "TOGGLE", element: "sample 1" };

  //when
  let { performanceTable } = rootReducer(state, action);

  //then
  let sample1 = findByName(performanceTable, "sample 1");
  expect(sample1.colapsed).toEqual(false);

  let sample2 = findByName(performanceTable, "sample 2");
  expect(sample2.colapsed).toEqual(false);
});

test("expand all elements", () => {
  // given
  let state = {
    colapsed: { "sample 1": true },
    perfData: [
      perfPointFixture({ benchmark: "sample 1" }),
      perfPointFixture({ benchmark: "sample 2" })
    ]
  };
  let action = { type: "EXPAND_ALL" };

  //when
  let { performanceTable } = rootReducer(state, action);

  //then
  let sample1 = findByName(performanceTable, "sample 1");
  expect(sample1.colapsed).toEqual(false);

  let sample2 = findByName(performanceTable, "sample 2");
  expect(sample2.colapsed).toEqual(false);
});

test("expand all elements", () => {
  // given
  let state = {
    colapsed: { "sample 1": true },
    perfData: [
      perfPointFixture({ benchmark: "sample 1" }),
      perfPointFixture({ benchmark: "sample 2" })
    ]
  };
  let action = { type: "COLLAPSE_ALL" };

  //when
  let { performanceTable } = rootReducer(state, action);

  //then
  let sample1 = findByName(performanceTable, "sample 1");
  expect(sample1.colapsed).toEqual(true);

  let sample2 = findByName(performanceTable, "sample 2");
  expect(sample2.colapsed).toEqual(true);
});

test("allows to switch screen", () => {
  // given
  let state = {
    screen: "screen one"
  };
  let action = { type: "SHOW_SCREEN", screen: "another screen" };

  //when
  let { screen } = rootReducer(state, action);

  //then
  expect(screen).toEqual("another screen");
});

test("shows line chart", () => {
  // given
  let state = {
    oldVersion: "1.0.0",
    newVersion: "1.0.1",
    rawdata: [
      dataPoint("1.0.0", "benchmark 1", "param1", 101, 1),
      dataPoint("1.0.0", "benchmark 1", "param1", 100, 2),
      dataPoint("1.0.1", "benchmark 1", "param1", 102, 3),
      dataPoint("1.0.1", "benchmark 1", "param1", 103, 4),
      dataPoint("1.0.1", "benchmark 1", "param2", 108, 5),
      dataPoint("1.0.1", "benchmark 2", "param1", 103, 4)
    ]
  };
  let action = {
    type: "SHOW_LINE_CHART",
    element: { benchmark: "benchmark 1", params: "param1" }
  };

  //when
  let { lineChart } = rootReducer(state, action);

  //then
  expect(lineChart).toEqual([
    {
      values: [
        { date: 1, params: "param1", value: 101 },
        { date: 2, params: "param1", value: 100 }
      ]
    },
    {
      values: [
        { date: 3, params: "param1", value: 102 },
        { date: 4, params: "param1", value: 103 }
      ]
    }
  ]);
});

test("after fetching data, transform than and go to first screen", () => {
  // given
  let state = {
    oldVersion: "1.0.0",
    newVersion: "1.0.1",
    colapsed: {},
    rawdata: [
      dataPoint("1.0.0", "benchmark 1", "param1", 101, 1),
      dataPoint("1.0.1", "benchmark 2", "param1", 103, 4)
    ]
  };
  let action = {
    type: "FETCH_DATA_SUCCESS",
    oldVersion: "old",
    newVersion: "new",
    data: [
      dataPoint("old", "benchmark 1", "param1", 101, 1),
      dataPoint("old", "benchmark 1", "param1", 102, 1),
      dataPoint("new", "benchmark 1", "param1", 103, 4),
      dataPoint("new", "benchmark 1", "param1", 104, 4)
    ]
  };

  //when
  let {
    rawdata,
    perfData,
    performanceTable,
    releaseSummary,
    lineChart
  } = rootReducer(state, action);

  //then
  expect(lineChart).toEqual([]);
  expect(rawdata).toEqual(action.data);
  expect(perfData).toMatchObject([
    {
      benchmark: "benchmark 1",
      newMean: 103.5,
      newStd: 0.5,
      oldMean: 101.5,
      oldStd: 0.5,
      params: "param1",
      values: [101, 102]
    }
  ]);
  expect(perfData[0].change).toBeCloseTo(-0.01980198, 3);

  expect(releaseSummary).toMatchObject([
    {
      benchmark: "benchmark 1",
      name: "param1",
      newMean: 103.5,
      newStd: 0.5,
      newValue: 103,
      newVariance: 0.25,
      oldMean: 101.5,
      oldStd: 0.5,
      oldValue: 101,
      oldVariance: 0.25,
      params: "param1",
      status: "negative-change",
      values: [101, 102]
    }
  ]);
  expect(releaseSummary[0].change).toBeCloseTo(-0.01980198, 3);
});
