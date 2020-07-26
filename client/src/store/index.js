import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { productReducer } from "./reducers"

const reducers = combineReducers({
    productReducer
})

const middlewares = applyMiddleware(thunk)

const store = createStore(reducers, middlewares)

export default store