import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Store Untuk Testing Local
// import { useDispatch, useSelector } from "react-redux"
// import { getProducts } from "../store/actions/productAction"

export default () => {
  // Store Untuk Testing Local
  // const dispatch = useDispatch()
  // const { products, productLoading, productError } = useSelector(state => state.productReducer)
  // const backgroundUrl =
  //   "https://i.pinimg.com/474x/8f/4e/8a/8f4e8a77b57c243fa020207909ef377a.jpg";

  const [items, setItems] = useState([]);
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // Store Untuk Testing Local
  // useEffect(() => {
  //     dispatch(getProducts())
  // }, [dispatch])

  useEffect(() => {
    document.addEventListener("csEvent", function (event) {
      setItems(event.detail);
    });
  }, []);
  
  return (
    <div style={styles.main}>
    <div className="container" style={styles.bodyHome}>
      <div className="row justify-content-center ">
        <div className="col-10">
          {
            // Store Untuk Testing Local
            // productLoading ? (
            //     <div className="spinner-grow" style={{ width: "3rem", height: "3rem" }} role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            // ) : productError ? (
            //     <h3 className="text-center p-5">{productError}</h3>
            // ) :
            items.length ? (
              <div className="mt-3">
                <h1 className="text-center pt-3 text-light" style={{fontFamily:"Comic Sans MS"}}>Product List</h1>
                <table 
                  className="table table-hover table-striped myTable text-light border" 
                  style={{backgroundColor:"#1f4068"}}
                >
                  <thead>
                    <tr className="">
                      <th scope="col">No</th>
                      <th scope="col">Image</th>
                      <th scope="col">Name</th>
                      <th scope="col">Current Price</th>
                      <th scope="col">Store</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((product, idx) => (
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
                        <td>
                          {currencyFormatter.format(product.currentPrice)}
                        </td>
                        <td>{product.storeName}</td>
                        <td>
                          <Link to={`/track/${product._id}`}>Track</Link>
                        </td>
                      </tr>
                    ))}

                    {/* HardCode Testing */}
                    {/* <tr>
                        <th scope="row">1</th>
                        <td>
                          <img
                            src="https://ecs7.tokopedia.net/img/cache/200-square/VqbcmM/2020/6/25/030d3b46-adca-40a9-81dd-4d088fbed8e1.jpg.webp"
                            alt="IMG"
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>"product.name"</td>
                        <td>
                          {currencyFormatter.format(1000000)}
                        </td>
                        <td>{"product.storeName"}</td>
                        <td>
                          <Link to={`/track/${"product._id"}`}>Track</Link>
                        </td>
                      </tr>
                    <tr>
                        <th scope="row">1</th>
                        <td>
                          <img
                            src="https://ecs7.tokopedia.net/img/cache/200-square/VqbcmM/2020/6/25/030d3b46-adca-40a9-81dd-4d088fbed8e1.jpg.webp"
                            alt="IMG"
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>"product.name"</td>
                        <td>
                          {currencyFormatter.format(1000000)}
                        </td>
                        <td>{"product.storeName"}</td>
                        <td>
                          <Link to={`/track/${"product._id"}`}>Track</Link>
                        </td>
                      </tr> */}
                  </tbody>
                </table>
              </div>
            ) : (
              <h1 className="text-center p-5" style={styles.fontH1}>No Data</h1>
            )
          }
          
        </div>
      </div>
    </div>
    </div>
  );
};

const styles = {
  main: {
    backgroundImage: "linear-gradient(#162447, #1f4068)",
    height: "92vh",
    marginTop: "8vh",
  },
  bodyHome: { 
    // backgroundColor: "#1f4068",
  },
  fontH1: { 
    fontFamily: "Comic Sans MS", 
    fontSize: "50px",
    color: "#eeeeee"
  },
};
