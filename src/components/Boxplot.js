import React, { useRef, useEffect } from "react";

import * as d3 from "d3";

const verticalLine = (svg, y, x1, x2) =>
  svg
    .append("line")
    .attr("y1", y)
    .attr("y2", y)
    .attr("x1", x1)
    .attr("x2", x2)
    .attr("stroke", "black");

const box = (svg, x, y, height, width) =>
  svg
    .append("rect")
    .attr("x", x)
    .attr("y", y - height / 2)
    .attr("height", height)
    .attr("width", width)
    .attr("stroke", "black")
    .style("fill", "black");

const ticks = (svg, data, fx, y, height) =>
  svg
    .selectAll("toto")
    .data(data)
    .enter()
    .append("line")
    .attr("y1", y - height)
    .attr("y2", y + height)
    .attr("x1", fx)
    .attr("x2", fx)
    .attr("stroke", "black");

const circles = (svg, values, fx, fy, colors) =>
  svg
    .selectAll("toto")
    .data(values)
    .enter()
    .append("circle")
    .attr("cx", fx)
    .attr("cy", fy)
    .attr("r", 3)
    .style("fill", (d, i) => colors[i]);

export const BoxPlotComponent = props => {
  const boxPlotContainer = useRef(null);

  useEffect(() => {
    if (props.data && boxPlotContainer.current) {
      var margin = { top: 10, right: 30, bottom: 30, left: 40 },
        width = 200 - margin.left - margin.right,
        height = 40 - margin.top - margin.bottom;

      const svg = d3
        .select(boxPlotContainer.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var { latestValue, currentValue, data } = props;
      var data_sorted = data.sort(d3.ascending);
      var q1 = d3.quantile(data_sorted, 0.05);
      var median = d3.quantile(data_sorted, 0.5);
      var q3 = d3.quantile(data_sorted, 0.95);
      var min = d3.min(data);
      var max = d3.max(data);

      var x = d3
        .scaleLinear()
        .domain([Math.min(min, latestValue), Math.max(max, latestValue)])
        .range([0, width]);

      var center = 10;
      var boxHeight = 3;
      verticalLine(svg, center, x(min), x(max));
      box(svg, x, center, boxHeight, x(q3) - x(q1));
      ticks(svg, [min, median, max], x, center, boxHeight);
      circles(svg, [currentValue, latestValue], x, () => center, [
        "#FF9900",
        "#3369E8"
      ]);
    }
  }, [props]);

  return (
    <svg className="graph2" width={400} height={16} ref={boxPlotContainer} />
  );
};
