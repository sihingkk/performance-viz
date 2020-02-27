import React from 'react';
import Container from './Container';
import Navbar from './Navbar';

import './App.css';


function App() {
  return (
    <div>
      <div className="columns header">
        <div className="column is-half">OLD -> NEW</div> <div className="column">details</div>
      </div>
    <Navbar/>
      <div className="column">
        <Container />
      </div>
    </div>

  );
}

export default App;
