import React from "react";
import Container from "./Container";
import Navbar from "./Navbar";

import "./App.css";

function Header() {
  return (
    <div className="columns header">
      <div className="column is-half">OLD -> NEW</div>
      <div className="column is-half"></div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Navbar />
      <div className="column">
        <Container />
      </div>
    </div>
  );
}

export default App;
