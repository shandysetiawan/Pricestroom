import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import dateformat from "dateformat"
import ExampleData from "../ExampleData"

export default () => {

    const data = ExampleData
    const [ newData ,setNewData ] = useState({})

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

    useEffect(()=> {
        if (data.history.length > 40 ) {
            data.history = data.history.slice(data.history.length - 40, data.history.length - 1)
        }
        setNewData({
            ...data, 
            history: data.history.map(his => {
                return {
                    [data.name]: his.price, 
                    time: dateformat(his.time, "h:MM:ss TT"),
                    stock: his.stock
                }
            })
        })
    },[data])

    useEffect(() => {
        const interval = setInterval(() => {
          console.log('This will run every 20 second!');
          //Do Fetching here
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ background: `url(${background})`, height: "100%" }}>
            <div className="row justify-content-center">
                <div className="col-4 mt-3">
                    <select className="form-control" onChange={onChangeBackground}>
                        {backgrounds.map((_, idx) => <option key={idx} value={idx}>background {idx + 1}</option>)}
                    </select>
                </div>
            </div>
            <div className="row justify-content-center">
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
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={data.name} stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </section>
                </div>
            </div>
            <div className="row justify-content-center">
                <div 
                    className="col bg-light text-dark border border-info rounded-lg mt-2 p-3 row justify-content-center" 
                    style={{ maxWidth: "900px" }}>
                    <div className="card mb-3" style={{maxWidth: "800px"}}>
                        <div className="row no-gutters">
                            <div className="col-md-4">
                                <img src={data.imageUrl} className="card-img" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{data.name}</h5>
                                    <p className="card-text">
                                        Initial Price: Rp.{data.initialPrice} <br/>
                                        Last Price: Rp.{data.currentPrice}<br/>
                                        {data.targetPrice ? `Target Price: ${data.targetPrice}` : ""}
                                        {data.targetPrice && <br/>}
                                        Store: {data.storeName}<br/>
                                        Ulr: <a href={data.url}>Go to Product</a>
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
    );
}
