import React, {useEffect} from 'react'
import {Row, Col, Alert, Button} from "react-bootstrap"
import Product from "../components/Product"
import Loader from "../components/Loader"
import ProductsCarousel from "../components/ProductsCarousel"
import Paginate from "../components/Paginate"
import Meta from "../components/Meta"
import {useSelector, useDispatch} from "react-redux"
import {productsSelector, fetchProducts} from "../Redux/Reducers/productsSlice"
import {Link} from "react-router-dom"


const HomeScreen = ({match}) => {

   const { productData, loading, hasErrors, errorMessage } = useSelector(productsSelector)
   const dispatch = useDispatch()

   const keyword = match.params.keyword 
   const pageNumber = match.params.pageNumber || 1

   useEffect( () => {
        dispatch( fetchProducts(keyword, pageNumber) )
   }, [dispatch, keyword, pageNumber])
    
    return (
        <>

            <Meta />

            {!keyword ? <ProductsCarousel /> :
             <Link to ='/'>
                <Button className = "btn-dark my-3 confirm rounded">Go Back</Button>
            </Link>}
            
            {!keyword && <h1 className = 'my-4 text-center' style={{color:"rgba(255,255,255,.9)"}}> Best Sellers </h1>}
            
                {loading ? <Loader /> :

                 hasErrors ? <Alert variant = "danger" style={{top:"4rem"}}> {errorMessage} </Alert> :

                 productData.length === 0 ?
                    <>
                        <Col md={12}>
                            <Row>
                                <Alert  className="d-flex align-items-center text-center my-2" 
                                        variant = "warning" 
                                        style={{position:"relative", marginRight:"auto", marginLeft:"auto"}}>
                                        Sorry, could not find any products 
                                </Alert>
                            </Row>
                        </Col>

                        
                        <Col>
                            <Row>
                                <Link to={"/"} style={{position:"relative", marginRight:"auto", marginLeft:"auto"}}>Go back</Link>
                            </Row>
                        </Col>    
                        
                    
                    </> :

                    <>
                    <Row>
                        {productData.products.map( product => (
                            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                        <Paginate page={productData.page} pages={productData.pages} keyword={ keyword ? keyword : ""} />
                    </>

                } 
            
        </>
    )
}

export default HomeScreen
