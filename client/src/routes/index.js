import React from "react"
import { Switch, Route } from "react-router-dom"
import { Home, About, NotFound } from "../pages"

export default () => {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/about" component={About}/>
            <Route component={NotFound}/>
        </Switch>
    )
}