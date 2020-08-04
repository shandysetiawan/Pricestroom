import {
    FETCH_PRODUCTS,
    SET_LOADING_PRODUCT,
    SET_ERROR_PRODUCTS,
    SET_PRODUCT
} from "../actionTypes"

const initialState = {
    products: [],
    productLoading: false,
    productError: null,
    product: {}
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
        case SET_PRODUCT:
            return {
                ...state,
                product : action.payload.data
            }
        default:
            return state
    }
}