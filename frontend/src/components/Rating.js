import React from 'react'

const Rating = ({value, text, color}) => {
    return (
        <>
        <div className = "rating">

            <span>
                <i style ={{color}} className = {value >=1 ? 'fas fa-star' : value >= 0.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>

            <span>
                <i style ={{color}} className = {value >=2 ? 'fas fa-star' : value >= 1.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>

            <span>
                <i style ={{color}} className = {value >=3 ? 'fas fa-star' : value >= 2.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>

            <span>
                <i style ={{color}} className = {value >=4 ? 'fas fa-star' : value >= 3.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>

            <span>
                <i style ={{color}} className = {value >=5 ? 'fas fa-star' : value >= 4.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
            </span>

        </div>
        <p className = 'my-2'>
        {text && text}
        </p>
        </>
    )
}

Rating.defaultProps = {
    color: '#e3c417'
}

export default Rating
