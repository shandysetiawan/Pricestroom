import axios from "axios"
import { 
    FETCH_PRODUCTS, 
    SET_LOADING_PRODUCT, 
    SET_ERROR_PRODUCTS
} from "../actionTypes"
// const baseUrl = "http://localhost:3001"
const baseUrl = "http://52.74.0.232:3001"

export function getProducts () {
    return (dispatch) => {
        dispatch({
            type: SET_LOADING_PRODUCT,
            payload: { value: true }
        })
        axios({
            method: "get",
            url: `${baseUrl}/tracks`
        })
            .then(({data}) => {
                dispatch({
                    type: FETCH_PRODUCTS,
                    payload: { data }
                })
            })
            .catch(({response}) => {
                dispatch({
                    type: SET_ERROR_PRODUCTS,
                    payload: {error: "Internal Server Error"}
                    // payload: {error: `${response.status}: ${response.statusText}`}
                })
            })
            .finally(_ => {
                dispatch({
                    type: SET_LOADING_PRODUCT,
                    payload: { value: false }
                })
            })
    }
}

// export function getProduct(id) {
//     return (dispatch) => {

//     }
// }