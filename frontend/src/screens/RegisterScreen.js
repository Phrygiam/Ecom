import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import {Row, Col, Button, Form, Container, Alert} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Meta from "../components/Meta"
import {signSelector, signIn} from "../Redux/Reducers/signSlice"
import {logSelector} from "../Redux/Reducers/logSlice"


const SignScreen = ({location, history}) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const dispatch = useDispatch()
    const sign = useSelector(signSelector)
    const {isLoading, hasErrors, errorMessage, signErrorMessage} = useSelector(signSelector)
    const log = useSelector(logSelector)
    
    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match")
        }
        dispatch(signIn(name, email, password))
    }

    useEffect( () => {
        if (log.isLogged === true) {
            history.replace("/")
        }
    },[log.isLogged, history])

    return (
        
        <Container className="d-flex flex-column align-items-center" style={{height: "100vh"}}>

            {isLoading ? <Loader /> : errorMessage.length !== 0 ? <Alert variant = "danger" style={{top:"4rem"}}> {errorMessage} </Alert> :

            <>
            
            <Meta title="Naoss Electronics | Register" />

            <h1 className="my-5 ivory" >Register Account</h1>
             
                <Form onSubmit={submitHandler} >

                    <Form.Group controlId="name" >
                        <Form.Label className="d-flex flex-column align-items-center ivory" >Name </Form.Label>
                        <Form.Control className= "coolBorder" type="name" placeholder="enter name" value={name} onChange={ (e)=> setName(e.target.value)}></Form.Control>
                        {signErrorMessage.includes("name") && <Message variant="danger">You must enter a valid username</Message>}
                    </Form.Group>

                    <Form.Group controlId="email" >
                        <Form.Label className="d-flex flex-column align-items-center ivory" >Email Address</Form.Label>
                        <Form.Control className= "coolBorder" type="email" placeholder="enter email" value={email} onChange={ (e)=> setEmail(e.target.value)}></Form.Control>
                        {signErrorMessage.includes("email") && <Message variant="danger">You must enter a valid email</Message>}
                    </Form.Group>

                    <Form.Group controlId="password" >
                        <Form.Label className="d-flex flex-column align-items-center ivory" >Password</Form.Label>
                        <Form.Control className= "coolBorder" type="password" placeholder="enter password" value={password} onChange={ (e)=> setPassword(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" >
                        <Form.Label className="d-flex flex-column align-items-center ivory" >Confirm Password</Form.Label>
                        <Form.Control className= "coolBorder" type="password" placeholder ="confirm password" value={confirmPassword} onChange={ (e)=> setConfirmPassword(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Row className="d-flex flex-column align-items-center">
                        {passwordError.length !==0 && <Message variant="danger">{passwordError}</Message>}
                    </Row>

                    <Button type="submit" className="btn-block btn-dark confirm rounded" size="md">Register</Button>
                    
                </Form>
            
                <Row className ="my-5">
                    <Col className="ivory">
                    Already have an account? <Link to={"/login"} style={{textDecoration: "none"}}><Button className ="btn-dark confirm rounded" size="sm">Login</Button></Link>
                    </Col>
                </Row>
             </>
            }
             

        </Container>
       
    )
}

export default SignScreen