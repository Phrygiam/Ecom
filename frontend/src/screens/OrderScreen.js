import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Image, Card, Container, Row, Col, Alert, ListGroup, Button} from "react-bootstrap"
import { PayPalButton } from "react-paypal-button-v2"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Meta from "../components/Meta"
import {logSelector} from "../Redux/Reducers/logSlice"
import {orderPaySelector, payOrder} from"../Redux/Reducers/orderPaySlice"
import {orderDeliverSelector, deliverOrder} from"../Redux/Reducers/orderDeliverSlice"
import {fetchOrderSelector, fetchOrder} from "../Redux/Reducers/fetchOrderSlice"
import {Link} from "react-router-dom"

const OrderScreen = ({match}) => {

        const orderId = match.params.id
        const dispatch = useDispatch()
        const {loading, hasErrors, message, orderInfo} = useSelector(fetchOrderSelector)
        const {isSuccessful, loadingPay} = useSelector(orderPaySelector)
        const {isDelivered, loadingDeliver} = useSelector(orderDeliverSelector)
        const logState = useSelector(logSelector)
        
        const [sdkReady, setSdkReady] = useState(false)

        useEffect( () => {
            
            // this is used to dynamycally add the paypal script to the frontend by fetching the clientId from the backend
            // for security reasons
            const addPayPalScript = async() => {
                // fetch client ID from the backend
                    const response = await fetch("/api/config/paypal")
                    const clientId = await response.text()
                    
                    const script = document.createElement("script")
                    script.type = "text/javascript"
                    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
                    // make the script asyncronous
                    script.async = true

                    script.onload = () => {
                        setSdkReady(true)
                    }
                    // then append the script to the body
                    document.body.appendChild(script)
            }

            if(orderInfo.length !== undefined || isSuccessful || isDelivered) {
                const token = logState.userInfo.token
                dispatch(fetchOrder(orderId, token))
            } else if (!orderInfo.isPaid) {
                if(!window.paypal) {
                    addPayPalScript()
                } else {
                    setSdkReady(true)
                }

            }
        }, [dispatch, orderId, isSuccessful, isDelivered, orderInfo.length, orderInfo.isPaid])

        // payment result comes from paypal
        const successPaymentHandler = (paymentResult) => {
            dispatch(payOrder(orderId, paymentResult))
        }

        const deliverHandler = () => {
            dispatch(deliverOrder(orderId))
        }
        
    return (
       <Container>
            {
              loading ? <Loader /> : logState.isLogged === false ? (<Alert variant = "danger" style={{top: "4rem"}}> You must be logged in to view your orders <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
             ) :  hasErrors ? (<Alert variant = "danger" style={{top:"4rem"}}> {message} <Link to="/" style={{marginLeft:"2rem"}}> Back </Link> </Alert>
             ) : (
                <>

                    <Meta title="Naoss Electronics | Order" />
                    
                    <h1 style={{position:"relative", left:"1rem", top:"1rem"}} className="orderID ivory"> Order ID: {orderInfo._id}</h1>

                    <Row style={{marginTop:"2rem"}}>
                        
                        <Col md={8}>

                            <ListGroup variant="flush">

                                <ListGroup.Item style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                                    <h3 className="mb-3" style={{color:"rgba(255,255,255,.8)"}}>Shipping</h3>

                                    <p className="h5 my-3" style={{color:"rgba(255,255,255,.8)"}}>Name: <span style={{marginLeft:"10px"}}>{orderInfo.user.name}</span></p>
                                        
                                    <p className="h5 my-3" style={{color:"rgba(255,255,255,.8)"}}>Email: <span style={{marginLeft:"10px"}}>{orderInfo.user.email}</span></p>
                                        
                                    <p className="h5 my-3" style={{color:"rgba(255,255,255,.8)"}}>Address:<span style={{marginLeft:"10px"}}>{orderInfo.shippingAddress.address} - {orderInfo.shippingAddress.city} - {orderInfo.shippingAddress.postalCode} - {orderInfo.shippingAddress.country}</span></p>
                                    <Row>
                                        <Col>
                                        {orderInfo.isDelivered ? (<Message variant="success">Delivered at: {orderInfo.deliveredAt.substring(0, 10)}</Message>
                                         ) : (
                                        <Message variant="danger">Not delivered</Message>
                                         )}
                                        </Col>
                                    </Row>  
                                </ListGroup.Item>
                                    
                                <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                                    <h3 className="mb-3" style={{color:"rgba(255,255,255,.8)"}}>Payment Method:</h3>
                                    <p className="h5" style={{color:"rgba(255,255,255,.8)"}}>Method:</p>
                                    <Row>
                                        <Col>
                                            <span style={{position:"relative", bottom:"10px"}}>{orderInfo.paymentMethod}</span>
                                        
                                            {orderInfo.paymentMethod === "PayPal" ? <i className="fab fa-cc-paypal fa-2x"></i> :
                                             orderInfo.paymentMethod === "Visa" ? <i className="fab fa-cc-visa fa-2x"></i> :
                                             <i className="fab fa-cc-amex fa-2x"></i>}
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                        {orderInfo.isPaid ? (<Message variant="success">Paid on: {orderInfo.paidAt.substring(0, 10)}</Message>
                                         ) : (
                                        <Message variant="danger">Not paid</Message>
                                         )}
                                        </Col>
                                    </Row>
                                    
                                </ListGroup.Item>

                                <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                                    <h3 style={{color:"rgba(255,255,255,.8)"}}>Order Items:</h3>
                                    {orderInfo.orderItems.length === 0 ? (<Message variant="danger">Your cart is empty</Message>
                                    ) : (
                                        <ListGroup variant="flush">
                                            {orderInfo.orderItems.map( (item, index) =>(
                                                <ListGroup.Item key={index} style={{backgroundColor: "rgba(0,0,0,.01)"}}>
                                                    <Row>
                                                        <Col md={2}>
                                                            <Image src={item.image} alt= {item.name} fluid rounded></Image>
                                                        </Col>

                                                        <Col>
                                                        <Link style={{color:"rgba(255,255,255,.8)"}} to={`/product/${item.product}`}> 
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
                            <Card style={{backgroundColor: "rgba(0,0,0,.05)"}}>
                                <ListGroup variant="flush">

                                    <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                                        <h3>Order Summary</h3>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"2px solid rgba(255,255,255,.2)"}}>
                                        <Row>
                                            <Col>Items:</Col>
                                            <Col>${orderInfo.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"2px solid rgba(255,255,255,.2)"}}>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>${orderInfo.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"2px solid rgba(255,255,255,.2)"}}>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>${orderInfo.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"2px solid rgba(255,255,255,.2)"}}>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>${orderInfo.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                
                                        {!orderInfo.isPaid && !logState.userInfo.isAdmin && (
                                            <ListGroup.Item style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                                                {loadingPay && <Loader />}
                                                {!sdkReady ? <Loader /> : (
                                                    <PayPalButton amount ={orderInfo.totalPrice} onSuccess={successPaymentHandler}></PayPalButton>
                                                )}
                                            </ListGroup.Item>
                                        )}

                                        {loadingDeliver && <Loader />}
                                        {logState.userInfo.length !==0 &&
                                         logState.userInfo.isAdmin &&
                                         orderInfo.isPaid &&
                                         !orderInfo.isDelivered &&
                                         <ListGroup.Item className="ivory" style={{background:"rgba(52, 58, 64, 0.1)", borderTop:"1px solid rgba(255,255,255,.2)"}}>
                                             <Button variant="dark" className="btn-md rounded confirm" onClick={deliverHandler}> Mark as delivered </Button>
                                         </ListGroup.Item>}
                                    
                                </ListGroup>
                            </Card>
                        </Col>

                    </Row>
            
                </>
             )}
        </Container>
    )
}

export default OrderScreen