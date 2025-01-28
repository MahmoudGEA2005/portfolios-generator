import React from "react";
import "./MainHeading.css"

function MainHeading({subtitle, children}) {
    return (
        <div className="main-heading">
            <p>{subtitle}</p>
            <h1>{children}</h1>
        </div>
    )
}

export default MainHeading;
