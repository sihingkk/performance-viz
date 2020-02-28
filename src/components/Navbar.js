import React from "react";
import { connect } from "react-redux";

function NavbarComponent({ showScreen, screen }) {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="columns">
        <div id="navbar" className="navbar-menu">
          <div className="navbar-start">
            <a
              href="#"
              className={
                "navbar-item " +
                (screen === "release-summary" ? "is-active" : "")
              }
              onClick={() => showScreen("release-summary")}
            >
              Release info
            </a>
            <a
              href="#"
              className={
                "navbar-item " + (screen === "details" ? "is-active" : "")
              }
              onClick={() => showScreen("details")}
            >
              Details
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

const mapStateToProps = ({ screen }) => ({ screen });

const mapDispatchToProps = dispatch => ({
  showScreen: screen => dispatch({ type: "SHOW_SCREEN", screen })
});

export default connect(mapStateToProps, mapDispatchToProps)(NavbarComponent);
