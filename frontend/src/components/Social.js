import React from 'react'
import {Link} from "react-router-dom"

const Social = () => {
    return (
        <>
            <div className="outerSocialContainer">
                <div className="innerSocialContainer">
                    <div className="socialIcons">
                        <Link to=""><i class="fab fa-facebook fa-2x"></i></Link>
                        <Link to=""><i class="fab fa-twitter fa-2x"></i></Link>
                        <Link to=""><i class="fab fa-instagram fa-2x"></i></Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Social
