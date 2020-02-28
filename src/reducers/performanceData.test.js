import { dataPoint } from ".";
import { performanceData } from "./performanceData";

const findBy = (coll, benchmark, params) =>
  coll.find(it => it.benchmark == benchmark && it.params == params);
test("use the latest data for performance table", () => {
  // given
  let points = [
    dataPoint("1.0.0", "benchmark 1", "param1", 101, 1),
    dataPoint("1.0.0", "benchmark 1", "param1", 100, 2),
    dataPoint("1.0.1", "benchmark 1", "param1", 102, 3),
    dataPoint("1.0.1", "benchmark 1", "param1", 103, 4)
  ];
  //when
  let result = performanceData(points, "1.0.0", "1.0.1");
  //then
  expect(findBy(result, "benchmark 1", "param1")).toMatchObject({
    benchmark: "benchmark 1",
    params: "param1",
    oldValue: 100,
    newValue: 103
  });
  expect(result[0].change).toBeCloseTo(-0.03, 3);
});

test("returns values for every combination of benchmark and params", () => {
  // given
  let points = [
    dataPoint("1.0.0", "benchmark 1", "param1", 100, 1),
    dataPoint("1.0.0", "benchmark 1", "param2", 100, 2),
    dataPoint("1.0.0", "benchmark 2", "param1", 100, 3),
    dataPoint("1.0.2", "benchmark 1", "param1", 100, 1),
    dataPoint("1.0.2", "benchmark 1", "param2", 100, 2),
    dataPoint("1.0.2", "benchmark 2", "param1", 100, 3)
  ];
  //when
  let result = performanceData(points, "1.0.0", "1.0.2");
  //then
  expect(result.length).toEqual(3);
  expect(findBy(result, "benchmark 1", "param2")).toMatchObject({
    benchmark: "benchmark 1",
    params: "param2",
    oldValue: 100,
    newValue: 100
  });
});
