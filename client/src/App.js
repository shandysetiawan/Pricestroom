import React from "react";
import { BrowserRouter as Router } from "react-router-dom"
import { Navbar } from "./components"
import Routes from "./routes"
// import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div>
      <Navbar/>
      <Routes/>
      </div>
    </Router>
  );
}

export default App;
