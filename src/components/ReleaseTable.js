import React from 'react';
import { connect } from 'react-redux'
import './ReleaseTable.css'

function Icon({type}) {
    return <span className="icon">
        <i className={type}></i>
    </span>
}

function TableGroupedRow({ name, colapsed, change, onClickHandler }) {
    return (<tr className="grouped">
        <td onClick={() => onClickHandler(name)}>
            {!colapsed && <Icon type="fas fa-caret-down"/>}
            {colapsed && <Icon type="fas fa-caret-right"/>} 
            {name}</td>
        <td></td>
        <td></td>
        <td><span className={change > 0 ? 'positive-change' : 'negative-change'}>{(change * 100).toFixed(2)}</span></td>
    </tr>)
}

function TableRow({ name, oldValue, newValue, change, oldVariance, newVariance }) {
    return (<tr className="detail-cell">
        <td className='table-row-name'>{name}</td>
        <td>{oldValue?.toFixed(2)} / {oldVariance?.toFixed(2)}</td>
        <td>{newValue?.toFixed(2)} / {newVariance?.toFixed(2)}</td>
        <td>
            <span className={change > 0 ? 'positive-change' : 'negative-change'}>{(change * 100)?.toFixed(2)}</span></td>
    </tr>)
}

export function PerformanceTable({ data, newVersion, oldVersion, toggle, expandAll, collapseAll }) {
    return (<table className='table Table'><thead><tr>
        <th><span  onClick={collapseAll}><Icon type='fas fa-minus-square'/></span>
        <span  onClick={expandAll}><Icon type='fas fa-plus-square'/></span>
        NAME</th>
        <th>{oldVersion} [ms]</th>
        <th>{newVersion} [ms]</th>
        <th>CHANGE [%]</th>
    </tr></thead>
        <tbody>
            {data.map((row) => row.type === 'grouped' ? <TableGroupedRow {...row} onClickHandler={toggle} /> : <TableRow {...row} />)}
        </tbody>
    </table>
    );
}

const mapStateToProps = ({ performanceTable, newVersion, oldVersion }) => ({
    data: performanceTable,
    newVersion,
    oldVersion
})
const mapDispatchToProps = dispatch => ({
    toggle: (element) => dispatch({ type: 'TOGGLE', element: element }),
    collapseAll: (element) => dispatch({ type: 'COLLAPSE_ALL', element: element }),
    expandAll: (element) => dispatch({ type: 'EXPAND_ALL', element: element })
})


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PerformanceTable)