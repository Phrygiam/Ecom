import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import {Button, Form, Container, Alert} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Meta from "../components/Meta"
import {fetchUpdateUserSelector, fetchUser, updateUser} from "../Redux/Reducers/fetchUpdateUserSlice"
import {logSelector} from "../Redux/Reducers/logSlice"

const UserEditScreen = ( {match, history} ) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)

    const userId = match.params.id
    const dispatch = useDispatch()
    const {loading, hasErrors, message, user} = useSelector(fetchUpdateUserSelector)
    const logState = useSelector(logSelector)

    

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser(name, email, isAdmin, userId))
    }

    useEffect( () => {
        
        if(!logState.isLogged) {
            history.push("/login")
        } else if (logState.userInfo && !logState.userInfo.isAdmin) {
            history.push("/")
        }

        if(!user.name || user._id !== userId) {
            dispatch(fetchUser(userId))
        } else {
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
        }
        
    },[dispatch, userId, user, logState, history])

    return (
        
        <Container className="d-flex flex-column align-items-center" >

            {loading ? <Loader /> : hasErrors === "serverError" ? <Message variant = "danger"> {message} </Message> :
            logState.isLogged === false ?
            <Alert variant = "danger" style={{marginTop: "4rem"}}> You must be logged in as an Admin to view this page <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
            :

            <>
            
                <Meta title="Admin Panel | Update User" />

                <Link to ='/admin/userList'>
                    <Button className = "btn-dark my-3 rounded confirm">Go Back</Button>
                </Link>
    
            <h1 className="my-5">Update Account</h1>
             
                <Form onSubmit={submitHandler} >

                    <Form.Group controlId="name">
                        <Form.Label className="d-flex flex-column align-items-center">Name </Form.Label>
                        <Form.Control className= "coolBorder" type="name" placeholder="enter name" value={name} onChange={ (e)=> setName(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="email" className="my-4">
                        <Form.Label className="d-flex flex-column align-items-center">Email Address</Form.Label>
                        <Form.Control className= "coolBorder" type="email" placeholder="enter email" value={email} onChange={ (e)=> setEmail(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="isAdmin">
                        <Form.Check
                            type="checkbox"
                            label="isAdmin"
                            checked={isAdmin}
                            onChange={ (e) => setIsAdmin(e.target.checked)}>                            
                        </Form.Check>
                    </Form.Group>

                    <Button type="submit" className="btn-block btn-dark my-5 rounded confirm" size="md">Update</Button>
                    
                </Form>    
             </>
            }
             
        </Container>
       
    )
}

export default UserEditScreen
