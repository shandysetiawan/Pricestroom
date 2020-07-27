import React from "react"

export default () => {
    const backgroundUrl = "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"

    return (
        <div className="container-fluid" style={{
            background: `url(${backgroundUrl})`,
            height: "100vh",
            position: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
        <h1 className="text-center pt-3" style={{
            fontSize: "100px",
            color: "black"
        }}>About</h1>
        <p className="container text-center pt-3" style={{
            fontSize: "25px",
            color: "black"
        }}>A Chrome Extension where users can watch the price for a specific product in Tokopedia and Bukalapak.
        After users add a product to be tracked, our server will scrape the specified website periodically to track the changes in price and graphic of price changes will also be displayed.
        Users can also opt to receive notification (push notification and/or by email) when the price hit the target price set by the user.</p>
        </div>
    )
}