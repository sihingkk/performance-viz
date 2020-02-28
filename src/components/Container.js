import React from "react";
import { connect } from "react-redux";
import PerformanceTable from "./PerformanceTable";
import LineChart from "./LineChart";
import { ReleaseSummary } from "./ReleaseSummary";

function ContainerComponent({ screen }) {
  return (
    <div className="container ">
      <div className="columns">
        <div className="column">
          <div>{screen === "release-summary" && <ReleaseSummary />}</div>
          {screen === "details" && <PerformanceTable />}
        </div>
        <div className="sidebar">
          <LineChart />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ screen }) => ({
  screen
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ContainerComponent);
