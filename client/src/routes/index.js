import React from "react"
import { Switch, Route } from "react-router-dom"
import { Home, Track, About, NotFound } from "../pages"

export default () => {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/track/:id" component={Track}/>
            <Route path="/about" component={About}/>
            <Route component={NotFound}/>
        </Switch>
    )
}