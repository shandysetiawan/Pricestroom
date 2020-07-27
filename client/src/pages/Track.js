import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios"
import {
    LineChart,
    Line, XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import dateformat from "dateformat"
// import ExampleData from "../ExampleData"

export default () => {

    const { id } = useParams()
    let [data, setData] = useState(null)
    const [newData, setNewData] = useState(data)
    const currencyFormatter = new Intl.NumberFormat("id", { style: 'currency', currency: 'IDR' })

    const backgrounds = [
        "https://i.pinimg.com/564x/2f/33/71/2f337177bd046a050deabeb6defbe4b0.jpg",
        "https://i.pinimg.com/564x/c5/1e/ef/c51eefd6458889941fff518c31e924b4.jpg",
        "https://i.pinimg.com/564x/96/ae/99/96ae99ba5b80a2f8ba635ee2100db5b0.jpg"
    ]
    const [background, setBackground] = useState([backgrounds[0]])

    function onChangeBackground(event) {
        const { value } = event.target
        setBackground(backgrounds[value])
    }

    function fetchData(productId) {
        axios({
            method: "get",
            url: `http://localhost:3001/tracks/${productId}`
        })
            .then(({ data: data2 }) => {
                setData(data2)
                // console.log(data2)
            })
            .catch(console.log)
    }

    useEffect(() => {
        // console.log("masuk")
        if (data) {
            if (data.history.length > 46) {
                data.history = data.history.slice(data.history.length - 46, data.history.length - 1)
                // console.log("sudah ada")
            }
            setNewData({
                ...data,
                history: data.history.map(his => {
                    return {
                        price: his.price,
                        time: dateformat(his.time, "h:MM:ss TT"),
                        stock: his.stock
                    }
                })
            })
        }
        // else {console.log("no data")}
    }, [data])

    useEffect(() => {
        fetchData(id)
        const interval = setInterval(() => {
            // console.log('This will run every 20 second!');
            fetchData(id)
        }, 20000);
        return () => clearInterval(interval);
    }, [id]);

    return (
        <div style={{ background: `url(${background})`, height: data ? "100%" : "100vh" }}>
            <div className="row justify-content-center">
                <div className="col-4 mt-3 align-self-center">
                    <select className="form-control" onChange={onChangeBackground}>
                        {backgrounds.map((_, idx) => <option key={idx} value={idx}>background {idx + 1}</option>)}
                    </select>
                </div>
            </div>
            {
                (data && newData) &&
                <div>
                    <div className="row justify-content-center mt-3">
                        <div className="col bg-light text-dark border border-info rounded-lg mt-2" style={{ maxWidth: "900px" }}>
                            <h1 className="text-center">Chart</h1>
                            <section id="Chart">
                                <LineChart
                                    width={800}
                                    height={400}
                                    data={newData.history}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis dataKey="price" domain={[dataMin => ((dataMin - 10000) <= 0 ? 0 : dataMin - 10000), 'dataMax + 10000']}/>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    {/* <Line type="monotone" dataKey={Object.keys(data.history[0])[1]} stroke="#8884d8" activeDot={{ r: 8 }} /> */}
                                </LineChart>
                            </section>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-3 pb-5">
                        <div
                            className="col bg-light text-dark border border-info rounded-lg mt-2 p-3 row justify-content-center"
                            style={{ maxWidth: "900px" }}>
                            <div className="card" style={{ maxWidth: "800px" }}>
                                <div className="row no-gutters">
                                    <div className="col-md-4">
                                        <img src={data.imageUrl} className="card-img" alt="..." />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{data.name}</h5>
                                            <p className="card-text">
                                                Initial Price: {currencyFormatter.format(data.initialPrice)} <br />
                                                Last Price: {currencyFormatter.format(data.currentPrice)}<br />
                                                {data.targetPrice ? `Target Price: ${currencyFormatter.format(data.targetPrice)}` : ""}
                                                {data.targetPrice && <br />}
                                                Store: {data.storeName}<br />
                                                <a href={data.url}><span role="img" aria-label="">🛒</span>Buy This Product</a>
                                            </p>
                                            <p className="card-text"><small className="text-muted">
                                                Last updated on {
                                                    dateformat(
                                                        Date(data.history[data.history.length - 1]),
                                                        "dddd, mmmm dS, yyyy, h:MM:ss TT"
                                                    )
                                                }
                                            </small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
