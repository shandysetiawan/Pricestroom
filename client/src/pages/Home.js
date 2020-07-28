import React, { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
// import { getProducts } from "../store/actions/productAction"

export default () => {

    // const dispatch = useDispatch()
    // const { products, productLoading, productError } = useSelector(state => state.productReducer)
    const currencyFormatter = new Intl.NumberFormat("id-ID", { style: 'currency', currency: 'IDR' })
    const [ items, setItems ] = useState([])

    const backgroundUrl = "https://i.pinimg.com/474x/8f/4e/8a/8f4e8a77b57c243fa020207909ef377a.jpg"

    // useEffect(() => {
    //     dispatch(getProducts())
    // }, [dispatch])

    useEffect(() => {
        document.addEventListener('csEvent', function(event) {
            setItems(event.detail)
        })
    },[])
    return (
        <div style={{
            background: `url(${backgroundUrl})`,
            height: "100vh"
        }}>

            <div className="row justify-content-center">
                <div className="col-10">
                    {
                        // productLoading ? (
                        //     <div className="spinner-grow" style={{ width: "3rem", height: "3rem" }} role="status">
                        //         <span className="sr-only">Loading...</span>
                        //     </div>
                        // ) : productError ? (
                        //     <h3 className="text-center p-5">{productError}</h3>
                        // ) : 
                        items.length ? (
                            <div className="mt-3">
                                <h1 className="text-center pt-3">Product List</h1>
                                <table className="table table-hover table-striped table-sm myTable">
                                    <thead>
                                        <tr className="table-info">
                                            <th scope="col">No</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Current Price</th>
                                            <th scope="col">Store</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((product, idx) =>
                                            <tr key={idx}>
                                                <th scope="row">{idx + 1}</th>
                                                <td>
                                                    <img
                                                        src={product.imageUrl}
                                                        alt="IMG"
                                                        style={{ width: "50px", height: "50px" }}
                                                    />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{currencyFormatter.format(product.currentPrice)}</td>
                                                <td>{product.storeName}</td>
                                                <td>
                                                    <Link to={`/track/${product._id}`}>Track</Link>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (<h3 className="text-center p-5">No Data</h3>)
                    }
                </div>
            </div>
        </div>
    )
}