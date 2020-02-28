import React from "react";
import { connect } from "react-redux";
import { Icon } from "./Icon";
import "./ReleaseTable.css";

function GroupedRow({
  name,
  colapsed,
  minChange,
  minStatus,
  maxChange,
  maxStatus,
  onClickHandler
}) {
  return (
    <tr className="grouped">
      <td onClick={() => onClickHandler(name)}>
        {!colapsed && <Icon type="fas fa-caret-down" />}
        {colapsed && <Icon type="fas fa-caret-right" />}
        {name}
      </td>
      <td colSpan="2"></td>
      <td colSpan="2">
        <span className={minStatus}>{(minChange * 100).toFixed(2)}%</span> -
        <span className={maxStatus}>{(maxChange * 100).toFixed(2)}%</span>
      </td>
    </tr>
  );
}

function Row(element) {
  let { name, oldValue, newValue, change, status, showLineChart } = element;
  return (
    <tr
      className="detail-cell clickable"
      onClick={() => showLineChart(element)}
    >
      <td className="table-row-name">
        <span>{name}</span>
      </td>
      <td>{oldValue?.toFixed(2)}</td>
      <td>{newValue?.toFixed(2)}</td>
      <td>{(newValue - oldValue).toFixed(2)}</td>
      <td>
        <span className={status}> {(change * 100)?.toFixed(2)}%</span>
      </td>
    </tr>
  );
}

export function PerformanceTableComponent({
  data,
  newVersion,
  oldVersion,
  toggle,
  expandAll,
  collapseAll,
  showLineChart
}) {
  return (
    <div className="table-container">
      <table className="table Table is-fullwidth">
        <thead>
          <tr>
            <th>
              <span onClick={collapseAll} className="clickable">
                <Icon type="fas fa-minus-square" />
              </span>
              <span onClick={expandAll} className="clickable">
                <Icon type="fas fa-plus-square" />
              </span>
              NAME
            </th>
            <th>{oldVersion} [ms]</th>
            <th>{newVersion} [ms]</th>
            <th>CHANGE [ms]</th>
            <th>CHANGE</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row =>
            row.type === "grouped" ? (
              <GroupedRow key={row.name} {...row} onClickHandler={toggle} />
            ) : (
              <Row
                key={row.name + row.benchmark}
                {...row}
                showLineChart={showLineChart}
              />
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

const mapStateToProps = ({ performanceTable, newVersion, oldVersion }) => ({
  data: performanceTable,
  newVersion,
  oldVersion
});

const mapDispatchToProps = dispatch => ({
  toggle: element => dispatch({ type: "TOGGLE", element }),
  collapseAll: element => dispatch({ type: "COLLAPSE_ALL", element }),
  expandAll: element => dispatch({ type: "EXPAND_ALL", element }),
  showLineChart: element => dispatch({ type: "SHOW_LINE_CHART", element })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformanceTableComponent);
