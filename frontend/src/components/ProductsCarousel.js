import React, {useEffect} from 'react'
import {Link} from "react-router-dom"
import {Carousel, Image, Row, Col} from "react-bootstrap"
import Loader from "./Loader"
import Message from "./Message"
import {topRatedSelector, fetchTopProducts} from "../Redux/Reducers/topProductsSlice"
import {useDispatch, useSelector} from "react-redux"

const ProductsCarousel = () => {

    const dispatch = useDispatch()
    const {topProducts, hasErrors, errorMessage, loading} = useSelector(topRatedSelector)

    useEffect( () => {
        dispatch(fetchTopProducts())
    }, [])

    return (
            
            <Row className="d-flex flex-column align-items-center">
                <Col md={9}>
                    {loading ?  < Loader />  :
                    hasErrors ?  <Message variant="warning"> {errorMessage} </Message>  : 
                    
                    <Carousel pause="hover" className="bg-dark">
                        { topProducts.length !== undefined && topProducts.map( product => (
                            <Carousel.Item key={product._id}>
                                <Link to={`/product/${product._id}`}>
                                    <Carousel.Caption className="carousel-caption">
                                        <strong className="carouselFont"> {product.name} (${product.price}) </strong>
                                    </Carousel.Caption>
                                    <Image src={product.image} alt={product.name} fluid className="my-5"/>
                                </Link>
                            </Carousel.Item>
                        )) }
                    </Carousel>
                    
                    }
                </Col>
            </Row>
    )
}

export default ProductsCarousel
