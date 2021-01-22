import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Form, Container} from "react-bootstrap"
import Rating from "../components/Rating"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Meta from "../components/Meta"
import {fetchDetails, detailsSelector} from "../Redux/Reducers/fetchUpdateProductSlice"
import {resetReview, fetchReview, productReviewSelector} from "../Redux/Reducers/productReviewSlice"
import {logSelector} from "../Redux/Reducers/logSlice"
import {useSelector, useDispatch} from "react-redux"

function ProductScreen({history, match}) {

    const dispatch = useDispatch()
    const { productDetails, loading, hasErrors, errorMessage } = useSelector(detailsSelector)
    const {productReview} = useSelector(productReviewSelector)
    
    const logState = useSelector(logSelector)

    const [quantity, setQuantity] = useState(1)

    useEffect( () => {
        let token = logState.userInfo.token
        dispatch(resetReview())
        dispatch(fetchReview(match.params.id, token))
        dispatch(fetchDetails(match.params.id))
    }, [match.params.id]) // we put this here, otherwise we will get a "missing dependancies" message
    
    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${quantity}`)
    }

    const createReviewHandler = () => {
        history.push(`/products/${match.params.id}/reviews`)
    }

    return (
        <Container>

            <Link to ='/'>
                <Button className = "btn-dark my-3 confirm rounded">Go Back</Button>
            </Link>
            
            { loading ? <Loader /> :

              hasErrors ? <Message variant = "danger"> {errorMessage} </Message> :
              
              <>
              <Meta title={productDetails.name} />
              <Row>
                <Col md={5}>
                    <Image src={productDetails.image} alt={productDetails.name} fluid></Image>
                </Col>

                <Col md={4}>

                    <ListGroup variant='flush'>

                        <ListGroup.Item>
                            <h3>{productDetails.name}</h3>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Rating value={productDetails.rating} text={`${productDetails.numReviews} reviews`}/> 
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Price: $ {productDetails.price}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Description: {productDetails.description}
                        </ListGroup.Item>
                    </ListGroup>

                </Col>

                
                <Col md={3} className="my-1">
                    
                    <ListGroup variant = "flush">
                       
                        <ListGroup.Item>
                            <Row>
                                <Col> Price: </Col>
                                <Col>$ {productDetails.price} </Col>
                            </Row>
                        </ListGroup.Item>  

                        <ListGroup.Item>  
                            <Row>
                                <Col> Status: </Col>
                                <Col className ={productDetails.countInStock > 0 ? "text-success font-weight-bold" : "text-danger font-weight-bold" }>{productDetails.countInStock > 0 ? "In Stock" : " Out of stock"} </Col>
                            </Row>  
                        </ListGroup.Item>

                        {productDetails.countInStock > 0 && (
                            <ListGroup.Item>
                                <Row>
                                    <Col> Quantity:</Col>
                                    <Col md="auto">
                                     <Form.Control as= "select" value = {quantity} onChange = { (e) => setQuantity(e.target.value)}>
                                         {
                                             [...Array(productDetails.countInStock).keys()].map( x => (
                                                 x < 5 && (
                                                    <option key = {x+1} value = {x+1}>
                                                        {x+1}
                                                    </option>
                                                 )
                                             ))
                                         }
                                     </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}

                        <ListGroup.Item>
                            <Button
                                onClick = {addToCartHandler}
                                className="btn-block rounded"
                                variant = "dark"
                                type="button"
                                disabled= {productDetails.countInStock ===0}>Add to cart</Button>
                        </ListGroup.Item>

                    </ListGroup>
                    
                </Col>
                
            </Row>
            
            <Row>
               <Col md={8}>
                  
                    <h1 className="review my-3" style={{color:"#343a40"}}>Reviews</h1>
    
                    { productDetails.reviews !== undefined && logState.isLogged && productReview.rating ?
                     <Button className = "reviewButton1 btn-dark my-4 confirm rounded"onClick={createReviewHandler}>Edit review</Button>
                     :
                     productDetails.numReviews !== 0 && productDetails.reviews !== undefined && logState.isLogged &&
                     <Button className = "reviewButton1 btn-dark my-4 confirm rounded" onClick={createReviewHandler}>Write a review</Button>
                    }
        
                   {productDetails.numReviews === 0 && logState.isLogged ? (
                        <>
                            <Message variant="success">There are no reviews yet</Message>
                            <Row>
                                <Col md={8}>
                                    <p className="h3" style={{marginBottom:"22px", color:"#343a40", fontStyle:"italic"}}>Be the first to review this product!</p>
                                </Col>
                            
                                <Col md={4}>
                                     <Button className = "btn-block btn-dark my-3 confirm rounded" 
                                             style={{position:"relative", bottom:"24px"}}
                                             onClick={createReviewHandler}>Write a review
                                     </Button>
                                </Col>
                            </Row>
                        </>
                   ) : (
                    productDetails.numReviews === 0 &&
                        <Message variant="warning">There are no reviews yet</Message> 
                    )}
                   <ListGroup variant="flush">
                       
                       { productDetails.reviews !== undefined && productDetails.reviews.map(review => (
                           
                           <ListGroup.Item key={review._id}>
                                <p style={{position:"relative", right:"12px"}}>{review.name}</p>
                                {}
                                <Row>
                                    <Col>
                                        <Rating value={review.rating}></Rating>
                                    </Col>
                                    <Col>
                                        <p> Reviewed on: {review.createdAt.substring(0, 10).split("-").reverse().join("-")}</p>
                                    </Col>
                                    <Col>
                                        { review.verified === "true" && <strong style={{color:"orange", fontSize:"1rem", fontWeight:"800"}}><i className="far fa-check-circle"></i>Verified purchase</strong>}
                                    </Col>
                                   
                                   
                                </Row>                              
                                <p style={{position:"relative", right:"12px"}}>{review.comment}</p>
                           </ListGroup.Item>
                       ))}
                     
                   </ListGroup>
               </Col>
            </Row>
                                        
            </>
            }
        
        </Container>
    )
}

export default ProductScreen
