import React from 'react'
import {Helmet} from "react-helmet"

const Meta = ( {title, keywords, description} ) => {
    return (
        <Helmet>
            <title> {title} </title>
            <meta name="description" content={description}></meta>
            <meta name="keyword" content={keywords}></meta>
        </Helmet>
    )
}

Meta.defaultProps = {
    title: "Naoss Electronics",
    description: "Best prices for pc builders enthusiasts",
    keywords: "electronics, pc, gpu, cpu, mobo, psu, monitor, case, ram, ssd, hdd"
}

export default Meta
