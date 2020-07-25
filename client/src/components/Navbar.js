import React from "react"
import { Link } from "react-router-dom"

export default () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand ml-3" to="/">LOGO</Link>
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
                            <Link className="nav-link" to="/"><span role="img" aria-label="">🏠</span>Home</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/about"><span role="img" aria-label="">🦊</span>About</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}