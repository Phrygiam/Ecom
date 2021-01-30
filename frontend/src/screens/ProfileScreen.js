import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import {Row, Col, Button, Form, Container, Alert, Table} from "react-bootstrap"
import {LinkContainer} from "react-router-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Meta from "../components/Meta"
import {logSelector, update} from "../Redux/Reducers/logSlice"
import {fetchOrderListSelector, listMyOrders} from "../Redux/Reducers/fetchOrderListSlice"

const ProfileScreen = ({history}) => {

    const dispatch = useDispatch()
    const {isLoading, hasErrors, message, userInfo} = useSelector(logSelector)
    const {listIsLoading, listHasErrors, listMessage, orderList} = useSelector(fetchOrderListSelector)
    const log = useSelector(logSelector)

    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match")
        }
        // you need to create a Redux slice that matches the profile backend functions and put it here
        dispatch(update(name, email, password))
    }

    useEffect( () => {
        let token = log.userInfo.token
        dispatch(listMyOrders(token))
    }, [dispatch, log.userInfo.token])

    return (
        <Container>
            {isLoading ? <Loader /> :
             hasErrors ? <Alert variant = "danger" style={{top:"4rem"}}> {message} </Alert> :
             log.isLogged === false ? (<Alert variant = "danger" style={{top: "4rem"}}> You must be logged in to view your profile <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
             ) : (
            <>

            <Meta title={ userInfo.name + " |" + " Profile Page"} />
            <Row>

                <Col md={3} className= "my-5">

                    <h2 className= "text-center ivory">My Profile</h2>

                    <Form onSubmit={submitHandler} >

                        <Form.Group controlId="name" >
                            <Form.Label className="d-flex flex-column align-items-center ivory">Name </Form.Label>
                            <Form.Control className= "coolBorder" type="name" placeholder="enter new name" value={name} onChange={ (e)=> setName(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email" >
                            <Form.Label className="d-flex flex-column align-items-center ivory">Email Address</Form.Label>
                            <Form.Control className= "coolBorder" type="email" placeholder="enter new email" value={email} onChange={ (e)=> setEmail(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="password" >
                            <Form.Label className="d-flex flex-column align-items-center ivory">Password</Form.Label>
                            <Form.Control className= "coolBorder" type="password" placeholder="enter new password" value={password} onChange={ (e)=> setPassword(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="confirmPassword" >
                            <Form.Label className="d-flex flex-column align-items-center ivory">Confirm Password</Form.Label>
                            <Form.Control className= "coolBorder" type="password" placeholder ="confirm new password" value={confirmPassword} onChange={ (e)=> setConfirmPassword(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Row className="d-flex flex-column align-items-center ivory">
                            {passwordError.length !==0 && <Message variant="danger">{passwordError}</Message>}
                        </Row>

                        <Button type="submit" className="btn-block btn-dark confirm rounded" size="md">Update</Button>
                    
                </Form>

                </Col>

                <Col md={9} style={{position:"relative"}}>

                    <h2 className= "my-5 ivory">My Orders</h2>
                    {listIsLoading ? <Loader /> :
                     listHasErrors ? <Message variant = "danger"> {listMessage} </Message> :

                     <Table striped bordered hover responsive className = "table-sm ivory">

                         <thead>
                             <tr>
                                <th>ID: </th>
                                <th>ORDERED: </th>
                                <th>TOTAL: </th>
                                <th>PAID: </th>
                                <th>DELIVERED: </th>
                                <th></th>
                             </tr>
                         </thead>

                         <tbody>
                             {orderList.map(order => (
                                 <tr key={order._id}>
                                     <td>{order._id}</td>
                                     <td>{order.createdAt.substring(0, 10)}</td> 
                                     <td>{order.totalPrice}</td>
                                     <td>{order.isPaid ? order.paidAt.substring(0, 10) : <i className = "fas fa-times" style={{color:"red"}}></i> }</td>
                                     <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <i className = "fas fa-times" style={{color:"red"}}></i> }</td>
                                     <td>
                                         <LinkContainer to ={`/order/${order._id}`}>
                                             <Button className= "btn-dark confirm rounded" size="sm">Details</Button>
                                         </LinkContainer>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </Table>}
                </Col>

            </Row>
            </>

             )}
        </Container>
    )
}
export default ProfileScreen
