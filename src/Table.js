import React from 'react';
import { connect } from 'react-redux'

function TableRow({benchmark,params,oldValue,newValue, change}) {
    return (<tr>          
                <td>{benchmark}</td>
                <td>{params}</td>            
                <td>{oldValue.toFixed(2)}</td>
                <td>{newValue.toFixed(2)}</td>
                <td>{change.toFixed(2)}</td>
           </tr>)
}

function PerformanceTable({data}) {
    return (<table><thead><tr>
                <th>benchmark</th>
                <th>params</th>
                <th>old</th>
                <th>new</th>
                <th>change</th>
            </tr></thead>
            <tbody>
                {data.map((row) => <TableRow {...row}/>)}
            </tbody>
            </table>
    );
}

const mapStateToProps = state => ({
    data: state.ui.performanceTable.data
  })
const mapDispatchToProps = dispatch => ({})
  

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PerformanceTable)