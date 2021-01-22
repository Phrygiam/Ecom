import React, {useEffect} from 'react'
import CheckoutSteps from "../components/CheckoutSteps"
import {useDispatch, useSelector} from "react-redux"
import {Image, Card, Container, Row, Col, Alert, ListGroup, Button} from "react-bootstrap"
import Message from "../components/Message"
import Meta from "../components/Meta"
import {shippingSelector} from "../Redux/Reducers/shippingSlice"
import {paymentSelector} from "../Redux/Reducers/paymentSlice"
import {cartSelector} from "../Redux/Reducers/cartSlice"
import {logSelector} from "../Redux/Reducers/logSlice"
import {amountSelector, setAmount} from "../Redux/Reducers/amountSlice"
import {orderSelector, placeOrder} from "../Redux/Reducers/orderSlice"
import {Link} from "react-router-dom"

const PlaceOrderScreen = ({history}) => {

        const dispatch = useDispatch()
        const cart = useSelector(cartSelector)
        const logState = useSelector(logSelector)
        const shippingState = useSelector(shippingSelector)
        const paymentState = useSelector(paymentSelector)
        const orderState = useSelector(orderSelector)
        const {itemsPrice, shippingPrice, taxPrice, totalPrice} = useSelector(amountSelector)

        // calculate price
        const addDecimals = (number) => {
            return (Math.round(number * 100)/100).toFixed(2)
        }


        const totalItemsPrice = addDecimals( cart.cartItems.reduce( (accumulator, item) => accumulator + item.price * item.quantity, 0) )
        const totalShippingPrice = addDecimals( totalItemsPrice > 100 ? 0 : 15 )
        const totalTaxPrice = addDecimals( Number((0.15 * totalItemsPrice).toFixed(2)) ) // basically apply 15 % 
        const fianlPrice = addDecimals( Number(totalItemsPrice) + Number(totalShippingPrice) + Number(totalTaxPrice) )
        dispatch(setAmount(totalItemsPrice, totalShippingPrice, totalTaxPrice, fianlPrice))

        const placeOrderHandler = () => {
            const userId = logState.userInfo._id
            dispatch(placeOrder({
                user: userId,
                orderItems: cart.cartItems,
                shippingAddress: shippingState.shippingInfo,
                paymentMethod: paymentState.paymentInfo,
                itemsPrice: itemsPrice, 
                shippingPrice: shippingPrice, 
                taxPrice: taxPrice, 
                totalPrice: totalPrice      
            }))

            
            
        }

        useEffect( () => {
            if(orderState.orderInfo.length!== 0) {
                
                history.push(`/order/${orderState.orderInfo._id}`)
            }
            // eslint-disable-next-line
        },[history, orderState.orderInfo.length])

        
    return (
       <Container className="my-5">
            {logState.isLogged === false ? (<Alert variant = "danger" style={{marginTop: "4rem"}}> You must be logged in to proceed to checkout <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
             ) :  orderState.hasErrors ? (<Message variant = "danger"> {orderState.message} </Message>
             ) :(
                <>

                    <Meta title="Naoss Electronics | Place Order" />
                    
                    <CheckoutSteps step1 step2 step3/>

                    <Row>

                        <Col md={8}>

                            <ListGroup variant="flush">

                                <ListGroup.Item>
                                    <h3 className="mb-3">Shipping</h3>
                                    <p className="h5">Address:</p>
                                        <span>{shippingState.shippingInfo.address} - {shippingState.shippingInfo.city} - {shippingState.shippingInfo.postalCode} - {shippingState.shippingInfo.country}</span>
                                </ListGroup.Item>
                                    
                                <ListGroup.Item>
                                    <h3 className="mb-3">Payment Method:</h3>
                                    <p className="h5">Method:</p>
                                    <Row>
                                        <Col>
                                            <span style={{position:"relative", bottom:"10px"}}>{paymentState.paymentInfo}</span>
                                        
                                            {paymentState.paymentInfo === "PayPal" ? <i className="fab fa-cc-paypal fa-2x"></i> :
                                             paymentState.paymentInfo === "Visa" ? <i className="fab fa-cc-visa fa-2x"></i> :
                                             <i className="fab fa-cc-amex fa-2x"></i>}
                                        </Col>
                                    </Row>
                                    
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h3>Order Items:</h3>
                                    {cart.cartItems.length === 0 ? (<Message variant="danger">Your cart is empty</Message>
                                    ) : (
                                        <ListGroup variant="flush">
                                            {cart.cartItems.map( (item, index) =>(
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={2}>
                                                            <Image src={item.image} alt= {item.name} fluid rounded></Image>
                                                        </Col>

                                                        <Col>
                                                        <Link to={`/product/${item.product}`}> 
                                                            {item.name}
                                                        </Link>
                                                        </Col>

                                                        <Col md={4}>
                                                            {item.quantity} x ${item.price} = ${item.quantity * item.price}
                                                        </Col>

                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                                </ListGroup.Item>

                            </ListGroup>

                        </Col>

                        <Col md={4}>
                            <Card>
                                <ListGroup variant="flush">

                                    <ListGroup.Item>
                                        <h3>Order Summary</h3>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items:</Col>
                                            <Col>${itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>${shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>${taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>${totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Button 
                                            type="button" 
                                            className="btn-block" 
                                            variant = "dark"
                                            disabled = {cart.cartItems.length === 0} 
                                            onClick={placeOrderHandler}> Place Order
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>

                    </Row>
            
                </>
             )}
        </Container>
    )
}

export default PlaceOrderScreen
