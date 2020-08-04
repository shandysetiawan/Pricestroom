import React from "react";
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import { Navbar } from "./components"
import store from "./store"
import Routes from "./routes"
// import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
    <Provider store={store}>
      <Router>
        <Navbar/>
        <Routes/>
      </Router>
    </Provider>
    </>
  );
}

export default App;
