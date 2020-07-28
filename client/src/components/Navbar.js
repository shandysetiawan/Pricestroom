import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/logo.png"

export default () => {
    
    const [ isTop, setIsTop ] = useState(true);

    useEffect(() => {
        document.addEventListener('scroll', () => {
            const Top = window.scrollY < 20;
            if (Top) {
                setIsTop(true)
            } else {
                setIsTop(false)
            }
        });
    },[])
        
    // console.log(state.isTop ? "down" : "Up")
    // console.log(window.scrollY)

    return (
        <div>
            <nav 
                style={{
                    overflow: "hidden",
                    position: "fixed",
                    width: "100vw",
                    top: 0,
                    zIndex: 1,
                    transition: "background-color 0.5s ease",
                    backgroundColor: (isTop ? "#162447" : "#0096c7" )
                }} className="navbar navbar-expand-lg navbar-dark"
            >
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="LOGO" style={{width:"175px"}}></img>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#navbarTogglerDemo02" 
                    aria-controls="navbarTogglerDemo02" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div 
                    className="collapse navbar-collapse" 
                    id="navbarTogglerDemo02">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item active"> 
                            <Link 
                                style={{color: isTop ? "#eeeeee" : "#222831", fontSize: "20px"}}
                                className="nav-link" 
                                to="/">
                                <span role="img" aria-label="">🏠</span>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item active">
                            <Link 
                                style={{color: isTop ? "#eeeeee" : "#222831", fontSize: "20px"}}
                                className="nav-link" 
                                to="/about">
                                <span role="img" aria-label="">🦊</span>
                                About
                            </Link>
                        </li>
                        {/* <p>{position.isTop ? "atas" : "bawah"}</p> */}
                    </ul>
                </div>
            </nav>
            {/* <hr style={{ 
                display: "block", 
                marginBefore: "0", 
                marginAfter: "0", 
                marginStart: "0", 
                marginEnd: "0", 
                overflow: "hidden", 
                borderStyle: "inset", 
                borderWidth: "1px"
            }}/> */}
        </div>
    )
}
