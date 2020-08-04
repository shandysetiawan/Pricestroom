import {
    FETCH_PRODUCTS,
    SET_LOADING_PRODUCT,
    SET_ERROR_PRODUCTS
} from "../actionTypes"

const initialState = {
    products: [],
    productLoading: false,
    productError: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS:
            return {
                ...state,
                products : action.payload.data
            }
        case SET_LOADING_PRODUCT:
            return {
                ...state,
                productLoading : action.payload.value
            }
        case SET_ERROR_PRODUCTS:
            return {
                ...state,
                productError : action.payload.error
            }
        default:
            return state
    }
}