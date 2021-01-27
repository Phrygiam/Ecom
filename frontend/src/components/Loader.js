import React from 'react'
import {Spinner} from "react-bootstrap"

const Loader = () => {
    return (
        <Spinner 
            animation = "border"
            role = "status" 
            style = {{
                width: "100px",
                height: "100px",
                margin: "auto auto 10rem auto",
                position:"relative",
                color: "rgba(255,255,255,.6)",
                top:"10rem",
                display:"block",
                }}>
            
            <span className = "sr-only">Loading...</span>
        </Spinner>
    )
}

export default Loader
