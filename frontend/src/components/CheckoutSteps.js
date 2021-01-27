import React from 'react'
import {Nav} from "react-bootstrap"
import {LinkContainer} from "react-router-bootstrap"
import {useSelector} from "react-redux"
import {shippingSelector} from "../Redux/Reducers/shippingSlice"
import {paymentSelector} from "../Redux/Reducers/paymentSlice"

const CheckoutSteps = ({step1, step2, step3, step4}) => {

    const shipping = useSelector(shippingSelector)
    const shippingData = shipping.shippingInfo
    const payment = useSelector(paymentSelector)
    const paymentData = payment.paymentInfo


    return (
        <Nav className = "justify-content-center" style={{position:"relative", top:"2rem"}}>

            <Nav.Item>
                { step1 ? (
                    <LinkContainer to = "/shipping" style={{border:shippingData.length !==0 ? "2px solid lightgreen" : "2px solid  #343a40"}}>
                        <Nav.Link className="checkoutNavLink"> <strong style={{color:"lightgreen"}}>Shipping</strong> </Nav.Link>
                    </LinkContainer>
                ) : (
                    <LinkContainer to = "/shipping">
                        <Nav.Link disabled> <strong style={{color:"rgba(255,255,255,.8)"}}>Shipping</strong> </Nav.Link>
                    </LinkContainer>
                )}
            </Nav.Item>

            <Nav.Item>
                { step2 ? (
                    <LinkContainer to = "/payment" style={{border: paymentData ? "2px solid lightgreen" : "2px solid  #343a40"}}>
                        <Nav.Link> <strong style={{color:"lightgreen"}}>Payment</strong> </Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled> <strong style={{color:"rgba(255,255,255,.8)"}}>Payment</strong> </Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                { step3 ? (
                    <LinkContainer to = "/placeorder" style={{border:"2px solid lightgreen"}}>
                        <Nav.Link> <strong style={{color:"lightgreen"}}>Place Order</strong> </Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled> <strong style={{color:"rgba(255,255,255,.8)"}}>Place Order</strong> </Nav.Link>
                )}
            </Nav.Item>

        </Nav>
    )
}

export default CheckoutSteps
