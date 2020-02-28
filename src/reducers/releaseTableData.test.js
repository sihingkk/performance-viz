import { changeStatus, releaseSummaryData } from "./realeaseTableData";
test("changes that are in 2 oldStd deviation are neutral", () => {
  // given
  let points = { oldMean: 10, oldStd: 5, newValue: 20, change: -1 };
  //when
  let result = changeStatus(points);
  //then
  expect(result).toEqual("neutral-change");
});

test("changes that are above 2 times std of old values and negative are negative", () => {
  // given
  let points = { oldMean: 10, oldStd: 5, newValue: 21, change: -1 };
  //when
  let result = changeStatus(points);
  //then
  expect(result).toEqual("negative-change");
});

test("changes that are above 2 times std of old values and positive are positive", () => {
  // given
  let points = { oldMean: 10, oldStd: 5, newValue: 21, change: 1 };
  //when
  let result = changeStatus(points);
  //then
  expect(result).toEqual("positive-change");
});

test("show only negative change for release summary", () => {
  // given
  let positive = { oldMean: 10, oldStd: 5, newValue: 21, change: 1 };
  let negative = { oldMean: 10, oldStd: 5, newValue: 21, change: -1 };
  let neutral = { oldMean: 10, oldStd: 5, newValue: 10, change: 1 };
  //when
  let result = releaseSummaryData([positive, negative, neutral]);
  //then
  expect(result).toMatchObject([
    {
      change: -1,
      newValue: 21,
      oldMean: 10,
      oldStd: 5,
      status: "negative-change"
    }
  ]);
});
