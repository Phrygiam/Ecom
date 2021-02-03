import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Form, Container, Alert} from "react-bootstrap"
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
    }, [match.params.id, dispatch, logState.userInfo.token])
    
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

              hasErrors ? <Alert variant = "danger" style={{top:"4rem"}}> {errorMessage} </Alert> :
              
              <>
              <Meta title={productDetails.name} />
              <Row>
                <Col md={5}>
                    <Image src={productDetails.image} alt={productDetails.name} fluid></Image>
                </Col>

                <Col md={4}>

                    <ListGroup variant='flush' style={{border:"2px solid rgba(255,255,255,.1)"}}>

                        <ListGroup.Item className="glass">
                            <h3 style={{color:"rgba(255,255,255,.8)"}}>{productDetails.name}</h3>
                        </ListGroup.Item>

                        <ListGroup.Item className="glass">
                            <Rating value={productDetails.rating} text={`${productDetails.numReviews} reviews`}/> 
                        </ListGroup.Item>

                        <ListGroup.Item className="glass">
                            <p className="ivory">Price: $ {productDetails.price}</p>
                        </ListGroup.Item>

                        <ListGroup.Item className=" glass overflow-auto" style={{maxHeight:"10rem"}}>
                            <p className="ivory"> {productDetails.description}</p>
                        </ListGroup.Item>
                    </ListGroup>

                </Col>

                
                <Col md={3} className="my-1">
                    
                    <ListGroup variant = "flush" style={{border:"2px solid rgba(255,255,255,.1)"}}>
                       
                        <ListGroup.Item className="glass">
                            <Row>
                                <Col className="ivory"> Price: </Col>
                                <Col className="ivory">$ {productDetails.price} </Col>
                            </Row>
                        </ListGroup.Item>  

                        <ListGroup.Item className="glass">  
                            <Row>
                                <Col className="ivory"> Status: </Col>
                                <Col className ={productDetails.countInStock > 0 ? "text-success font-weight-bold" : "text-danger font-weight-bold" }>{productDetails.countInStock > 0 ? "In Stock" : " Out of stock"} </Col>
                            </Row>  
                        </ListGroup.Item>

                        {productDetails.countInStock > 0 && (
                            <ListGroup.Item className="glass">
                                <Row>
                                    <Col className="ivory"> Quantity:</Col>
                                    <Col md="auto">
                                     <Form.Control as= "select" value = {quantity} onChange = { (e) => setQuantity(e.target.value)} className="glass" style={{color:"lightgreen",   background: "rgb(59 64 68)"}}>
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

                        <ListGroup.Item className="glass">
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
                  
                    <h1 className="review my-3 ivory">Reviews</h1>
    
                    { productDetails.reviews !== undefined && logState.isLogged && productReview.rating ?
                     <Button className = "reviewButton1 btn-dark my-4 confirm rounded"onClick={createReviewHandler}>Edit review</Button>
                     :
                     productDetails.numReviews !== 0 && productDetails.reviews !== undefined && logState.isLogged &&
                     <Button className = "reviewButton1 btn-dark my-4 confirm rounded" onClick={createReviewHandler}>Write a review</Button>
                    }
        
                   {productDetails.numReviews === 0 && logState.isLogged ? (
                        <>
                            <Message variant="warning">There are no reviews yet</Message>
                            <Row>
                                <Col md={8}>
                                    <p className="h3" style={{marginBottom:"22px", color:"rgba(255,255,255,.8)", fontStyle:"italic"}}>Be the first to review this product!</p>
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
                           
                           <ListGroup.Item key={review._id} className="glass ivory">
                                <p style={{position:"relative", right:"12px"}}>{review.name}</p>
                                
                                <Row>
                                    
                                        <Rating value={review.rating}></Rating>
                                    
                                        <p className="reviewDate"> Reviewed on: {review.createdAt.substring(0, 10).split("-").reverse().join("-")}</p>
                                    
                                        { review.verified === "true" && <strong className="verifiedPurchase"><i className="far fa-check-circle"></i>Verified purchase</strong>}
                                    
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
