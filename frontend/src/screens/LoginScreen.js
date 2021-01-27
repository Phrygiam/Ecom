import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import {Row, Col, Button, Form, Container} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Meta from "../components/Meta"
import {logSelector, login} from "../Redux/Reducers/logSlice"

const LoginScreen = ({history}) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()
    const log = useSelector(logSelector)
    const {isLoading, hasErrors, errorMessage, logErrorMessage} = useSelector(logSelector)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email,password))
    }

    useEffect( () => {
        if (log.isLogged === true) {
            history.push("/")
        }
    },[log.isLogged, history])

    return (
        
        <Container className="d-flex flex-column align-items-center" style={{height: "50vh"}}>

            {isLoading ? <Loader /> : errorMessage.length !== 0 ? <Message variant = "danger"> {errorMessage} </Message> :

            <>
            
            <Meta title="Naoss Electronics | Login" />
            
            <h1 className="my-5 ivory">Sign in</h1>
             
                <Form onSubmit={submitHandler} >

                    <Form.Group controlId="email" >
                        <Form.Label className="ivory">Email Address</Form.Label>
                        <Form.Control type="email" placeholder="enter email" className="coolBorder" value={email} onChange={ (e)=> setEmail(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="password" >
                        <Form.Label className="ivory">Password</Form.Label>
                        <Form.Control type="password" placeholder="enter password" className="coolBorder" value={password} onChange={ (e)=> setPassword(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Button type="submit" className="btn-block btn-dark confirm rounded" size="md">Log in</Button>
                    
                </Form>

                <Row style={{position:"relative", top:"1rem"}}>
                    {logErrorMessage.length !== 0 && <Message variant="danger">{logErrorMessage}</Message>}
                </Row>
            
                <Row className ="my-5">
                    <Col className="ivory">
                    New customer? <Link to={"/register"} style={{textDecoration: "none"}}><Button className ="btn-dark confirm rounded" size="sm">Register</Button></Link>
                    </Col>
                </Row>
             </>
            }
             

        </Container>
       
    )
}

export default LoginScreen
