import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Form, Container, Alert} from "react-bootstrap"
import Rating from "../components/Rating"
import Loader from "../components/Loader"
import Meta from "../components/Meta"
import {fetchDetails, detailsSelector} from "../Redux/Reducers/fetchUpdateProductSlice"
import {createReview, fetchReview, deleteReview, productReviewSelector} from "../Redux/Reducers/productReviewSlice"
import {logSelector} from "../Redux/Reducers/logSlice"
import {useSelector, useDispatch} from "react-redux"

const ProductReviewScreen = ({match, history}) => {

    const { 
        loading: loadingReview, 
        productReview, 
        errorMessage: reviewErrorMessage, 
        createErrorMessage, 
        deleteErrorMessage, 
        successMessage,
        deleteMessage
    } = useSelector(productReviewSelector)

    const [rating, setRating] = useState("")
    const [comment, setComment] = useState("")
    const [successComment, setSuccessComment] = useState("")
    const [deleteComment, setDeleteComment] = useState("")

    const logState = useSelector(logSelector)
    const dispatch = useDispatch()

    const { productDetails, loading, hasErrors, errorMessage } = useSelector(detailsSelector)

    useEffect( () => {
        if(!logState.isLogged) {
            history.push("/login")
        }
        
        const token = logState.userInfo.token

        dispatch(fetchDetails(match.params.id))
        dispatch(fetchReview(match.params.id, token))
        setRating(productReview.rating)
        setComment(productReview.comment)
        
    }, [match.params.id,productReview.rating, productReview.comment,logState, dispatch, history])

    useEffect( () => {
        if (successMessage.length > 0) {
            setSuccessComment("Review successfully added!")
        }

        if (deleteMessage.length > 0) {
            setDeleteComment("Review successfully deleted!")
        }
    }, [successMessage, deleteMessage])

    const submitHandler = (e) => {
        e.preventDefault()
        const token = logState.userInfo.token
        dispatch(createReview(match.params.id, rating, comment, token))
    }

    const deleteHandler = (e) => {
        e.preventDefault()
        const token = logState.userInfo.token
        dispatch(deleteReview(match.params.id, token))
    }


    return (
        
        <Container>
            
            <Link to = {`/product/${match.params.id}`}>
                <Button className = "btn-dark my-3 confirm rounded">Go Back</Button>
            </Link>
            
            { loading ? <Loader /> :

            hasErrors ? <Alert variant = "danger" style={{top:"4rem"}}> {errorMessage} </Alert> :
            <>
            <Meta title={productDetails.name + " |" + " Review"} />
            <Row>
                <Col md={4}>
                    <Image src={productDetails.image} alt={productDetails.name} fluid></Image>
                </Col>

                <Col md={6}>

                    <ListGroup variant='flush'>

                        <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                            <h3>{productDetails.name}</h3>
                        </ListGroup.Item>

                        <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                            <Rating value={productDetails.rating} text={`${productDetails.numReviews} reviews`}/> 
                        </ListGroup.Item>

                        <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                            Price: $ {productDetails.price}
                        </ListGroup.Item>

                        <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                            Description: {productDetails.description}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>
            </Row>
            </>
            }

            { loadingReview ? <Loader /> :
              
              createErrorMessage.length > 0 ? <Alert variant = "danger"> {createErrorMessage} <Link to={`/product/${match.params.id}`} style={{marginLeft:"2rem"}}>Go back</Link></Alert> :
              deleteErrorMessage.length > 0 ? <Alert variant = "danger"> {deleteErrorMessage} <Link to={`/product/${match.params.id}`} style={{marginLeft:"2rem"}}>Go back</Link></Alert> :
              reviewErrorMessage.length > 0 ? <Alert variant = "danger"> {reviewErrorMessage} <Link to={`/product/${match.params.id}`} style={{marginLeft:"2rem"}}>Go back</Link></Alert> :
              
              deleteComment.length > 0 ? <Alert variant = "success"> {deleteComment} <Link to={`/product/${match.params.id}`} style={{marginLeft:"2rem"}}>Go back</Link></Alert> :
              successComment.length > 0 ? <Alert variant = "success"> {successComment} <Link to={`/product/${match.params.id}`} style={{marginLeft:"2rem"}}>Go back</Link></Alert> :

            <Row>
                <>
                <Col md={8}>
                    <h5 className="ivory" style={{marginTop:"2rem", fontStyle:"italic"}}> Write a customer review</h5>
                    <Form onSubmit={submitHandler} className="my-5">

                    <Col md={4} className="my-5">

                        <Form.Group controlId="rating">
                            <Form.Label className="ivory" >Rating</Form.Label>
                            <Form.Control as="select" 
                                        value={rating}
                                        onChange={ (e) => setRating(e.target.value)}
                                        className="coolBorder">
                            <option value="" >Select value</option>
                            <option value="1">1 - Very unsatisfied</option>
                            <option value="2">2 - Unsatisfied</option>
                            <option value="3">3 - Decent</option>
                            <option value="4">4 - Satisfied</option>
                            <option value="5">5 - Extremely satisfied</option>
                            </Form.Control>
                        </Form.Group>
                        {createErrorMessage.includes("NaN") && <Alert variant = "danger"> Rating is required </Alert>}
                    </Col>
                    
                    <Col md={8}>
                        <Form.Group controlId="comment">
                            <Form.Label className="ivory">Your review</Form.Label>
                            <Form.Control as="textarea" 
                                          value={comment}
                                          row="4" 
                                          onChange={ (e) => setComment(e.target.value)}
                                          className="coolBorder"></Form.Control>
                        </Form.Group>
                        {createErrorMessage.includes("comment") && <Alert variant = "danger"> Comment is required </Alert>}
                    </Col>

                    <Row md={3}>
                        <Col>
                            <Button type="submit" className = "btn-block btn-dark my-3 confirm rounded ">Submit</Button>
                        </Col>
                        { productReview.rating >= 0 &&

                        <Col>
                            <Button className = "btn-block btn-dark my-3 cancel rounded " onClick={deleteHandler}>Delete</Button>
                        </Col>
                        }
                    </Row>
        
                    </Form>
                </Col>
            </>
            </Row>
            }    
                   
        </Container>  
    )
}

export default ProductReviewScreen
