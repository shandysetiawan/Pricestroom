import React, { useState, useEffect } from "react"
import logo from "../assets/logo.png"

export default () => {
    const [members, setMember] = useState([])


    useEffect(() => {

        setMember(["Cokrosiamdani", "Zulkifli", "Chairul Akmal", "Rudy Harun", "Shandy Setiawan"])
    }, [])


    return (
        <>
            <div className="container border border-dark" style={styles.bodyAbout}>
                <h1 className="text-center mb-3 mt-3">Our Team</h1>
                <hr></hr>
                <p>A Chrome Extension where users can watch the price for a specific product in Tokopedia and Bukalapak. After users add a product to be tracked, our server will scrape the specified website periodically to track the changes in price and graphic of price changes will also be displayed. Users can also opt to receive notification (push notification and/or by email) when the price hit the target price set by the user.</p>

                <div className="row row-cols-md-5">
                    {members.map((member) => {
                        return <div className="col-4 mb-1">

                            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" style={styles.imageSetting} className="card-img-top rounded-circle mb-3" alt="..." />
                            <div className="card h-70">
                                <div className="card-body text-center">
                                    <h5 className="card-title slotName">{member}</h5>
                                    <p className="card-text">FullStack Javascript</p>
                                </div>
                            </div>
                        </div>
                    })}

                </div>
                <div>
                    <img src={logo} style={styles.imageLogo} className="card-img-top" />
                </div>
            </div>
        </>
    )
}

const styles = {
    bodyAbout: { backgroundColor: "#B8B8F3" },
    imageSetting: { height: "37%" },
    imageLogo: { width: "103%", marginLeft: "-1.5%", height: "8em", marginTop: "-6em" },
    slotName: { paddingRight: "2rem", paddingLeft: "100rem" }
}


