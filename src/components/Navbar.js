import React from 'react';
import { connect } from 'react-redux'

function NavbarComponent({showScreen}) {
    return (<nav class="navbar" role="navigation" aria-label="main navigation">
      <div className="columns">
        <div class="navbar-brand">
          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbar">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
  
        <div id="navbar" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" onClick={() => showScreen('table')}>Table</a>
            <a class="navbar-item" onClick={() => showScreen('chart')}>Chart</a>
          </div>
        </div>
  
      </div>
    </nav>)
  }
  
  const mapStateToProps = ({  }) => ({})
  
  const mapDispatchToProps = dispatch => ({
    showScreen: (screen) => dispatch({ type: 'SHOW_SCREEN', screen }),  
  })
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavbarComponent)