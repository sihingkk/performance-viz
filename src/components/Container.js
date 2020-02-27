import React from 'react';
import { connect } from 'react-redux'
import PerformanceTable from './ReleaseTable'

function ContainerComponent({screen}) {
    return (
        <div className="container">
            {screen==='table' && <PerformanceTable />}
            {screen==='chart' && <div>Chart</div>}
        </div>)
}

const mapStateToProps = ({ screen }) => ({
    screen,    
})
const mapDispatchToProps = dispatch => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContainerComponent)