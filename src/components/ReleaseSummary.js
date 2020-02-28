import React, { useState } from "react";
import { connect } from "react-redux";
import { BoxPlotComponent } from "./Boxplot";
import { Modal } from "./Modal";
import "./ReleaseTable.css";

function Row(element) {
  let {
    name,
    oldValue,
    newValue,
    change,
    status,
    values,
    showLineChart,
    benchmark
  } = element;
  return (
    <tr
      className="detail-cell clickable"
      onClick={() => showLineChart(element)}
    >
      <td className="table-row-name">
        <span>
          {benchmark}
          <br />
          {name}
        </span>
      </td>
      <td>{oldValue?.toFixed(2)}</td>
      <td>{newValue?.toFixed(2)}</td>
      <td>{(newValue - oldValue).toFixed(2)}</td>
      <td>
        <span className={status}> {(change * 100)?.toFixed(2)}%</span>
      </td>
      <td>
        <BoxPlotComponent
          data={values}
          latestValue={newValue}
          currentValue={oldValue}
        />
      </td>
    </tr>
  );
}

const ExplainStatusModal = props => {
  return (
    <Modal {...props}>
      <div className="box">
        <table className="table">
          <tbody>
            <tr>
              <td>
                <span className="negative-change"> -25%</span>
              </td>
              <td>Change above 2 times std deviation from mean.</td>
            </tr>
            <tr>
              <td>
                <span className="positive-change"> 10%</span>
              </td>
              <td>Change above 2 times std deviation from mean.</td>
            </tr>
            <tr>
              <td>
                <span className="neutral-change"> 8%</span>
              </td>
              <td> Change in range of 2 times std deviation from mean.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

const ReleaseSummaryIntro = ({ data }) => {
  return (
    <div>
      <h2 className="title">
        {data.length > 0 && (
          <span>
            Found {data.length} potential regressions, please check them before
            rolling out release:
          </span>
        )}
        {data.length === 0 && (
          <span>
            Congratulations! it seems there are no potential regressions.
          </span>
        )}
      </h2>
    </div>
  );
};

const ReleaseSummaryTable = ({
  data,
  oldVersion,
  newVersion,
  showLineChart,
  showExplainBoxplot,
  showExplanStatus
}) => {
  return (
    <table className="table Table is-fullwidth">
      <thead>
        <tr>
          <th></th>
          <th>{oldVersion} [ms]</th>
          <th>{newVersion} [ms]</th>
          <th>CHANGE [ms]</th>
          <th onClick={() => showExplanStatus(true)} className="clickable">
            CHANGE <i className="fa fa-question-circle"></i>
          </th>
          <th onClick={() => showExplainBoxplot(true)} className="clickable">
            BOXPLOT <i className="fa fa-question-circle"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <Row
            key={row.name + row.benchmark}
            {...row}
            showLineChart={showLineChart}
          />
        ))}
      </tbody>
    </table>
  );
};

export function ReleaseSummaryTableComponent(props) {
  let { data = [] } = props;
  const [explainBoxplotShown, showExplainBoxplot] = useState(false);
  const [explainStatusShown, showExplanStatus] = useState(false);
  return (
    <div className="table-container">
      <ReleaseSummaryIntro data={data} />
      <Modal modalShown={explainBoxplotShown} showModal={showExplainBoxplot}>
        <img src="legend-boxplot.png" />
      </Modal>
      <ExplainStatusModal
        modalShown={explainStatusShown}
        showModal={showExplanStatus}
      />
      <ReleaseSummaryTable
        {...props}
        showExplainBoxplot={showExplainBoxplot}
        showExplanStatus={showExplanStatus}
      />
    </div>
  );
}

const mapStateToProps = ({ releaseSummary, newVersion, oldVersion }) => ({
  data: releaseSummary,
  newVersion,
  oldVersion
});

const mapDispatchToProps = dispatch => ({
  showLineChart: element => dispatch({ type: "SHOW_LINE_CHART", element })
});

const SummaryTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReleaseSummaryTableComponent);

export const ReleaseSummary = () => {
  return (
    <div>
      <SummaryTable />
    </div>
  );
};
