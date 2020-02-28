import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Icon } from "./Icon";
import "./LineChart.css";
import * as d3 from "d3";

export const LineChartComponent = props => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (props.data && d3Container.current) {
      var { data } = props;

      var margin = { top: 10, right: 20, bottom: 30, left: 30 };
      var width = 400 - margin.left - margin.right;
      var height = 565 - margin.top - margin.bottom;
      d3.select(d3Container.current)
        .selectAll("*")
        .remove();
      const svg = d3
        .select(d3Container.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      var xScale = d3
        .scaleTime()
        .domain([
          d3.min(data, co => d3.min(co.values, d => d.date)),
          d3.max(data, co => d3.max(co.values, d => d.date))
        ])
        .range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(5));

      var yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, co => d3.max(co.values, d => d.value))])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(yScale));

      var line = d3
        .line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(d3.curveCatmullRom.alpha(0.5));

      svg
        .selectAll(".line")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", d => line(d.values))
        .style("stroke", (d, i) => ["#FF9900", "#3369E8"][i])
        .style("stroke-width", 2)
        .style("fill", "none");
    }
  }, [props]);

  return (
    <div className="sticky">
      {props.selectedElement && (
        <div>
          <div className="chartTitle">
            <h1 className="title">{props.selectedElement.benchmark}</h1>
            <h2 className="subtitle">{props.selectedElement.params}</h2>
          </div>
          <svg className="graph " width={400} height={200} ref={d3Container} />
          <div className="legend">
            <Icon type="fas fa-square" className="oldSerie" />
            old serie
            <Icon type="fas fa-square" className="newSerie" />
            new serie
          </div>
        </div>
      )}
    </div>
  );
};

function responsivefy(svg) {
  var container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

  svg
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

  function resize() {
    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}

const mapStateToProps = ({ lineChart, selectedElement }) => ({
  data: lineChart,
  selectedElement
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LineChartComponent);
