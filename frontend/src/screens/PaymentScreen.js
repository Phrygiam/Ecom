import React, {useState, useEffect} from 'react'
import CheckoutSteps from "../components/CheckoutSteps"
import {useDispatch, useSelector} from "react-redux"
import {Form, Button, Container, Row, Col, Alert} from "react-bootstrap"
import {shippingSelector} from "../Redux/Reducers/shippingSlice"
import {paymentSelector, savePaymentMethod} from "../Redux/Reducers/paymentSlice"
import {logSelector} from "../Redux/Reducers/logSlice"
import {Link} from "react-router-dom"
import Meta from "../components/Meta"

const PaymentScreen = ({ history }) => {

    const dispatch = useDispatch()
    const logState = useSelector(logSelector)
    const shippingState = useSelector(shippingSelector)
    const shippingData = shippingState.shippingInfo
    const paymentState = useSelector(paymentSelector)
    const paymentData = paymentState.paymentInfo

    const [paymentMethod, setPaymentMethod] = useState(paymentData)
  
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push("/placeorder")
    }

    useEffect( () => {
        if(!shippingData.address) {
            history.push("/shipping")
        }
    }, [history, shippingData.address])

    return (
        <Container className="my-5">
            {logState.isLogged === false ? (<Alert variant = "danger" style={{marginTop: "4rem"}}> You must be logged in to proceed to checkout <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
             ) : (
                <>
                    <Meta title="Naoss Electronics | Payment" />
                    
                    <CheckoutSteps step1 step2/>
                    <h1 className = "text-center my-5" style={{color:"#343a40"}}>Payment</h1>

                    <Form onSubmit={submitHandler} className="d-flex flex-column align-items-center">

                        <Form.Group>

                            <Form.Label as="legend">Select Method</Form.Label>

                            <Col>
                                <Row className = "my-3">
                                    <Form.Check
                                        type="radio"
                                        value="PayPal"
                                        id="1"
                                        label="check for PayPal"
                                        name="paymentMethod"
                                        checked = {paymentMethod === "PayPal"}
                                        onChange={ (e) => setPaymentMethod(e.target.value)}>
                                    </Form.Check>
                                    <i className="fab fa-cc-paypal fa-2x"></i>
                                </Row>

                                <Row className = "my-3">
                                    <Form.Check
                                        type="radio"
                                        value="Visa"     
                                        id="2"
                                        label="check for Visa"
                                        name="paymentMethod"
                                        checked = {paymentMethod === "Visa"}
                                        onChange={ (e) => setPaymentMethod(e.target.value)}>
                                    </Form.Check>
                                    <i className="fab fa-cc-visa fa-2x"></i>
                                </Row>

                                <Row className = "my-3">
                                    <Form.Check 
                                        type="radio"
                                        value="AmericanExpress"
                                        id="3"
                                        label="check for AmericanExpress"
                                        name="paymentMethod"
                                        checked = {paymentMethod === "AmericanExpress"}
                                        onChange={ (e) => setPaymentMethod(e.target.value)}>
                                    </Form.Check>
                                    <i className="fab fa-cc-amex fa-2x"></i>
                                </Row>
                            </Col>

                        </Form.Group>

                        <Row className="d-flex flex-column align-items-center my-3">
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

export default PaymentScreen