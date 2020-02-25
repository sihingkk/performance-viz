import React from 'react';
import { connect } from 'react-redux'
import './ReleaseTable.css'

function TableGroupedRow({name,colapsed,change,onClickHandler}) {
    return (<tr>          
                <td onClick={() => onClickHandler(name)}><span>{colapsed ? '|>|' : '|V|'}</span> {name}</td>
                
                <td></td>
                <td></td>
                <td><span className={change > 0 ?'positive-change' : 'negative-change'}>{change.toFixed(2)}</span></td>
           </tr>)
}

function TableRow({name,oldValue,newValue, change}) {
    return (<tr>                                   
                <td className='table-row-name'>{name}</td>                            
                <td>{oldValue?.toFixed(2)}</td>
                <td>{newValue?.toFixed(2)}</td>
                <td><span className={change > 0 ?'positive-change' : 'negative-change'}>{change?.toFixed(2)}</span></td>
           </tr>)
}

const mixed = [
    {name:"In.executePlan", change: 3, type: 'grouped', isOpen: false},
    {name:"ExpandExpand.executePlan", oldValue:5898.30990506666, newValue:4389.33913599999, change: 2.00, type: 'grouped', isOpen: true},
    {name:"(engine,COMPILED) (hitRatio,50) (isConstant,false) (size,10)", oldValue:2.31885994233743, newValue:2.17447145645488, change: -0.20, type: 'point'},
    {name:"(engine,COMPILED) (hitRatio,50) (isConstant,false) (size,1000)", oldValue:211.517621038673, newValue:211.517621038673, change: 0, type: 'point'}]
    


export function PerformanceTable({data, toggle}) {
 //   data=mixed;
    return (<table className='Table'><thead><tr>                
                <th>NAME</th>                
                <th>1.0.0 [ms]</th>
                <th>1.1.0 [ms]</th>
                <th>CHANGE</th>
            </tr></thead>
            <tbody>
                {data.map((row) => row.type === 'grouped' ? <TableGroupedRow {...row} onClickHandler={toggle}/> : <TableRow {...row}/>)}
            </tbody>
            </table>
    );
}

const mapStateToProps = state => ({
    data: state.performanceTable
  })
const mapDispatchToProps = dispatch => ({
    toggle: (element) => dispatch({type: 'TOGGLE', element: element})
})
  

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PerformanceTable)