import React, {useState} from 'react'
import CheckoutSteps from "../components/CheckoutSteps"
import Meta from "../components/Meta"
import {useDispatch, useSelector} from "react-redux"
import {Form, Button, Container, Row, Col, Alert} from "react-bootstrap"
import {shippingSelector, shipping} from "../Redux/Reducers/shippingSlice"
import {logSelector} from "../Redux/Reducers/logSlice"
import {Link} from "react-router-dom"

const ShippingScreen = ({ history }) => {

    const dispatch = useDispatch()
    const shippingState = useSelector(shippingSelector)
    const logState = useSelector(logSelector)
    const shippingData = shippingState.shippingInfo

    const [address, setAddress] = useState(shippingData.address)
    const [city, setCity] = useState(shippingData.city)
    const [postalCode, setPostalCode] = useState(shippingData.postalCode)
    const [country, setCountry] = useState(shippingData.country)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(shipping(address, city, postalCode, country))
        history.push("/payment")
    }

    return (
        <Container>
            {logState.isLogged === false ? (<Alert variant = "danger" style={{marginTop: "4rem"}}> You must be logged in to proceed to checkout <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
             ) : (
                <>
                
                    <Meta title="Naoss Electronics | Shipping" />

                    <CheckoutSteps step1/>
                    <h1 className = "text-center my-5" style={{color:"#343a40"}}>Shipping</h1>

                    <Form onSubmit={submitHandler}>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="address" >
                                    <Form.Label className="d-flex flex-column align-items-left">Address </Form.Label>
                                    <Form.Control className= "coolBorder" type="text" placeholder="enter address" value={address} required onChange={ (e)=> setAddress(e.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="city" >
                                    <Form.Label className="d-flex flex-column align-items-left">City </Form.Label>
                                    <Form.Control className= "coolBorder" type="text" placeholder="enter city" value={city} required onChange={ (e)=> setCity(e.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="postalCode" >
                                    <Form.Label className="d-flex flex-column align-items-left">Postal Code </Form.Label>
                                    <Form.Control className= "coolBorder" type="text" placeholder="enter postal code" value={postalCode} required onChange={ (e)=> setPostalCode(e.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="country" >
                                    <Form.Label className="d-flex flex-column align-items-left">Country </Form.Label>
                                    <Form.Control className= "coolBorder" type="text" placeholder="enter country" value={country} required onChange={ (e)=> setCountry(e.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6} className="d-flex flex-column align-items-center">
                                <Button type="submit" className="btn btn-dark confirm" size="md" style={{width:"15rem"}}>Continue</Button>
                            </Col>
                        </Row>
                    </Form>
                </>
             )}
        </Container>
    )
}

export default ShippingScreen
