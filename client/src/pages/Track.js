import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import dateformat from "dateformat";
import backgroundOcean from "../assets/background-ocean.jpg"
import backgroundSky from "../assets/background-sky.jpg"

export default () => {

  // const baseUrl = "http://localhost:3001"
  const baseUrl = "http://13.229.109.104:3001" // AWS Zul
  // const baseUrl = "http://52.74.0.232:3001" // AWS Shandy

  const { id } = useParams();
  let [data, setData] = useState(null);
  const [newData, setNewData] = useState(data);
  const currencyFormatter = new Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
  });

  const backgrounds = [
    false,
    backgroundOcean,
    backgroundSky,
  ];
  const [background, setBackground] = useState(false);

  function onChangeBackground(event) {
    const { value } = event.target;
    setBackground(backgrounds[value]);
  }

  function fetchData(productId) {
    axios({
      method: "get",
      url: `${baseUrl}/tracks/${productId}`,
    })
      .then(({ data: data2 }) => {
        setData(data2);
        // console.log(data2)
      })
      .catch(console.log);
  }

  useEffect(() => {
    // console.log("masuk")
    if (data) {
      if (data.history.length > 46) {
        data.history = data.history.slice(
          data.history.length - 46,
          data.history.length - 1
        );
        // console.log("sudah ada")
      }
      setNewData({
        ...data,
        history: data.history.map((his) => {
          return {
            price: his.price,
            time: dateformat(his.time, "h:MM:ss TT"),
            stock: his.stock,
          };
        }),
      });
    }
    // else {console.log("no data")}
  }, [data]);

  useEffect(() => {
    fetchData(id);
    const interval = setInterval(() => {
      // console.log('This will run every 20 second!');
      fetchData(id);
    }, 20000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div
      style={{
        marginTop: "8vh",
        height: data ? "100%" : "100vh",
        backgroundImage: background ? `url(${background})` : "linear-gradient(#162447, #1f4068)",
        backgroundSize: "cover"
      }}
    >
      
      <div className="row justify-content-center">
        <div className="col-4 mt-3 align-self-center">
          <select className="form-control" onChange={onChangeBackground}>
            {backgrounds.map((_, idx) => (
              <option key={idx} value={idx}>
                background {idx + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      {data && newData && (
        <div>
          <div className="row justify-content-center mt-3">
            <div
              className="col text-dark border border-info rounded-lg mt-2"
              style={{ maxWidth: "900px", backgroundColor: '#1f4068' }}
            >
              <h1 className="text-center" style={styles.fontH1}>Chart</h1>
              <section id="Chart" className="col" >
                <LineChart
                  width={800}
                  height={400}
                  data={newData.history}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid 
                    stroke="#eee" 
                    strokeDasharray="4 4" 
                  />
                  <XAxis 
                    dataKey="time" 
                    stroke="#eee" 
                    angle={-10} 
                    textAnchor="end"
                    // position='insideLeft'
                  />
                  <YAxis 
                    dataKey="price" 
                    stroke="#eee" 
                    domain={[
                      (dataMin) => (dataMin - 10000 <= 0 ? 0 : dataMin - 10000),
                      "dataMax + 10000",
                    ]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </section>
            </div>
          </div>
          <div className="row justify-content-center mt-3 pb-5">
            <div
              className="col text-light border border-info rounded-lg mt-2 p-3 row justify-content-center"
              style={{ maxWidth: "900px", backgroundColor: '#1f4068' }}
            >
              <div className="" style={{ maxWidth: "800px" }}>
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <img src={data.imageUrl} className="card-img" alt="..." />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{data.name}</h5>
                      <p className="card-text">
                        Initial Price: {currencyFormatter.format(data.initialPrice)}<br />
                        Last Price: {currencyFormatter.format(data.currentPrice)}<br />
                        {data.targetPrice
                          ? `Target Price: ${currencyFormatter.format(data.targetPrice)}`
                          : ""
                        }
                        {data.targetPrice && <br />}
                        Store: {data.storeName}<br />
                        <a href={data.url}>
                          <span role="img" aria-label="">🛒 </span>
                          Buy This Product
                        </a>
                      </p>
                      <p className="card-text">
                        <small className="" style={{color:"#eeeeee"}}>
                          Last updated on {
                            dateformat(Date(data.history[data.history.length - 1]),
                              "dddd, mmmm dS, yyyy, h:MM:ss TT")
                          }
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  main: {
    // marginTop: "30px", 
  },
  fontParagraph: { fontFamily: "Leckerli One", fontSize: "large" },
  fontH1: { fontFamily: "Leckerli One", fontSize: "50px", color: "#eeeeee" },
};