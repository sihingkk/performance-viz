import React from 'react';
import { connect } from 'react-redux'
import './ReleaseTable.css'

function TableGroupedRow({name,colapsed,change,onClickHandler}) {
    return (<tr>          
                <td onClick={() => onClickHandler(name)}><span>{colapsed ? '|>|' : '|V|'}</span> {name}</td>                
                <td></td>
                <td></td>
                <td><span className={change > 0 ?'positive-change' : 'negative-change'}>{(change*100).toFixed(2)}</span></td>
           </tr>)
}

function TableRow({name,oldValue,newValue, change}) {
    return (<tr>                                   
                <td className='table-row-name'>{name}</td>                            
                <td>{oldValue?.toFixed(2)}</td>
                <td>{newValue?.toFixed(2)}</td>
                <td><span className={change > 0 ?'positive-change' : 'negative-change'}>{(change*100)?.toFixed(2)}</span></td>
           </tr>)
}

export function PerformanceTable({data,newVersion,oldVersion, toggle}) {
    return (<table className='Table'><thead><tr>                
                <th>NAME</th>                
                <th>{oldVersion} [ms]</th>
                <th>{newVersion} [ms]</th>
                <th>CHANGE [%]</th>
            </tr></thead>
            <tbody>
                {data.map((row) => row.type === 'grouped' ? <TableGroupedRow {...row} onClickHandler={toggle}/> : <TableRow {...row}/>)}
            </tbody>
            </table>
    );
}

const mapStateToProps = ({performanceTable,newVersion,oldVersion}) => ({
    data: performanceTable,
    newVersion,
    oldVersion    
  })
const mapDispatchToProps = dispatch => ({
    toggle: (element) => dispatch({type: 'TOGGLE', element: element})
})
  

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PerformanceTable)