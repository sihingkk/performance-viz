import React from 'react';
import { PerformanceTable } from '../ReleaseTable';

export default {
  title: 'PerformanceTable',
  component: PerformanceTable,
};

const closed = [
    {name:"In.executePlan", change: 3, type: 'grouped', isOpen: false},
    {name:"ExpandExpand.executePlan", oldValue:5898.30990506666, newValue:4389.33913599999, change: 2.00, type: 'grouped', isOpen: false}];

const opened = [
    {name:"In.executePlan", change: 3, type: 'grouped', isOpen: true},
    {name:"(engine,COMPILED) (hitRatio,50) (isConstant,false) (size,10)", oldValue:2.31885994233743, newValue:2.17447145645488, change: -0.20, type: 'point'},
    {name:"(engine,COMPILED) (hitRatio,50) (isConstant,false) (size,1000)", oldValue:211.517621038673, newValue:211.517621038673, change: 0, type: 'point'},
    {name:"ExpandExpand.executePlan", oldValue:5898.30990506666, newValue:4389.33913599999, change: 2.00, type: 'grouped', isOpen: true},
    {name:"(engine,COMPILED) (hitRatio,50) (isConstant,false) (size,10)", oldValue:2.31885994233743, newValue:2.17447145645488, change: -0.20, type: 'point'},
    {name:"(engine,COMPILED) (hitRatio,50) (isConstant,false) (size,1000)", oldValue:211.517621038673, newValue:211.517621038673, change: 0, type: 'point'}]


const mixed = [
    {name:"In.executePlan", change: 3, type: 'grouped', isOpen: false},
    {name:"ExpandExpand.executePlan", oldValue:5898.30990506666, newValue:4389.33913599999, change: 2.00, type: 'grouped', isOpen: true},
    {name:"(engine,COMPILED) (hitRatio,50) (isConstant,false) (size,10)", oldValue:2.31885994233743, newValue:2.17447145645488, change: -0.20, type: 'point'},
    {name:"(engine,COMPILED) (hitRatio,50) (isConstant,false) (size,1000)", oldValue:211.517621038673, newValue:211.517621038673, change: 0, type: 'point'}]
    

export const Closed = () => <PerformanceTable data={closed} toggle={(id) => console.log("clicked: ", id)} />;

export const Opened = () => <PerformanceTable data={opened} toggle={(id) => console.log("clicked: ", id)}/>;

export const Mixed = () => <PerformanceTable data={mixed} toggle={(id) => console.log("clicked: ", id)}/>;

export const EmptyTable = () => <PerformanceTable data={[]} toggle={(id) => console.log("clicked: ", id)}/>;