import React, { useEffect } from 'react'
import { Row, Col, ListGroup, Image, Button, Card, Alert} from "react-bootstrap"
import { Link } from "react-router-dom"
import Message from "../components/Message"
import Meta from "../components/Meta"
import { useSelector, useDispatch } from "react-redux"
import {cartSelector, fetchCart} from "../Redux/Reducers/cartSlice"


const CartScreen = ({match, location, history}) => {

    const productId = match.params.id 
    const newQuantity = location.search ? Number(location.search.split("=")[1]) : 1


    const dispatch = useDispatch()
    const cart = useSelector(cartSelector)

    useEffect( () => {
            productId && dispatch(fetchCart(productId, newQuantity, cart))
            history.replace("/cart")   
    }, [dispatch, productId, newQuantity, cart, history])

    const checkOutHandler = () => {
        history.push("/shipping")
    }


    return (
        <>
        <Meta title="Naoss Electronics | Cart" />
        <Row md={12}>
            <Col>
                {cart.cartItems.length === 0 ? ( <Alert variant = "warning" style={{marginTop: "4rem"}}> Your Shopping Cart is empty. <Link to="/" style={{marginLeft:"2rem"}}>Go Back</Link> </Alert> 
                ):(
                    <ListGroup variant="flush" className="my-5" md={12}>
                        {cart.cartItems.map(item =>(

                            <ListGroup.Item key={item.product}>

                                <Row>

                                    <Col md={4} sm={12}>
                                        <Image src={item.image} alt={item.name} fluid rounded></Image>
                                    </Col>

                                    <Col md={2} className = "my-3 h5">
                                        <Link to={`/product/${item.name}`}>{item.name}</Link>
                                    </Col>

                                    <Col md={2} className = "my-3 h5">${item.price}</Col>

                                        <Col>

                                            <Row>
                                                <Col className= "d-flex align-items-center">
                                                    <Button style={{marginRight:"1rem"} }onClick={() => dispatch(fetchCart(item.product,1, cart))} className = "btn-dark confirm" size="sm">+</Button>
                            
                                                   {item.quantity}
                                            
                                                    <Button style={{marginRight:"1rem", marginLeft:"1rem"}} onClick={() => dispatch(fetchCart(item.product,-1, cart))} className = "btn-dark center confirm" size="sm">-</Button>
                                            
                                                    <Button style={{marginRight:"1rem"}} onClick={() => dispatch(fetchCart(item.product,"del", cart))} className = "btn-dark cancel" size="sm"> <i className="fas fa-trash-alt"></i> </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col sm={12} style={{position:"relative", right: "1rem"}}>
                                                    {item.message.length >1 && <Message variant = "warning">{item.message}</Message>}
                                                    
                                                </Col>
                                            </Row>

                                        </Col>                                                                                                                       
                                </Row> 

                            </ListGroup.Item>
                        ))} 
                    </ListGroup>
                )}
            </Col>

            <Col md={4}>
                <Card className = "my-5">
                    <ListGroup variant = "flush">

                            <ListGroup.Item>
                                <h3>Subtotal ({cart.cartItems.reduce( (accumulator, currentItem) => accumulator + currentItem.quantity, 0 )}) items</h3>
                                $ {cart.cartItems.reduce( (accumulator, currentItem) => accumulator + currentItem.quantity * currentItem.price, 0).toFixed(2)}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                    <Button type="button" className = "btn-dark confirm rounded" disabled={cart.cartItems.length === 0} onClick = {checkOutHandler}>Proceed To Checkout</Button>
                            </ListGroup.Item>

                    </ListGroup>
                </Card>
            </Col>
            
        </Row>
        </>
    )
}

export default CartScreen
