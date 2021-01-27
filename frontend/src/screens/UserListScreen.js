import React, {useEffect} from 'react'
import {LinkContainer} from "react-router-bootstrap"
import {Link} from "react-router-dom"
import {Table, Alert, Button, Container} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Meta from "../components/Meta"
import {userListSelector, fetchUsers} from "../Redux/Reducers/userListSlice"
import {logSelector} from "../Redux/Reducers/logSlice"
import {deleteUser} from "../Redux/Reducers/fetchUpdateUserSlice"

const UserListScreen = ({history}) => {

    const dispatch = useDispatch()
    const {loading, hasErrors, message, users} = useSelector(userListSelector)
    const logState = useSelector(logSelector)
    
    const deleteHandler = (id) => {
        if(window.confirm("Are you sure?")) {
            dispatch(deleteUser(id))
        }
    }

    useEffect( () => {
        if(!logState.isLogged) {
            history.push("/login")
        } else if(logState.userInfo && logState.userInfo.isAdmin) {
            let token = logState.userInfo.token
            dispatch(fetchUsers(token))
        } else if (logState.userInfo && !logState.userInfo.isAdmin) {
            history.push("/")
        }
        
    }, [dispatch, history, logState])
    
    return (
        <Container>
            {loading ? <Loader /> :
             hasErrors ? <Alert variant = "danger" style={{top: "4rem"}}> {message} </Alert> :
             logState.isLogged === false ? (<Alert variant = "danger" style={{top: "4rem"}}> You must be logged in as an Admin to view this page <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
             ) : (
                 <>

                 <Meta title="Admin Panel | Users List" />
                 
                 <h1 className ="ivory" style={{position:"relative", top:"2rem"}}> Users </h1>
                 <Table striped bordered hover responsive className="my-5 table-sm ivory">
                    <thead>
                        <tr>
                            <th>ID: </th>
                            <th>NAME: </th>
                            <th>EMAIL: </th>
                            <th>ADMIN: </th>
                            <th>EDIT</th>
                        </tr>
                    </thead>
                    <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td> {user._id} </td>
                                    <td> {user.name} </td>
                                    <td> {user.email} </td>
                                    <td>{user.isAdmin ?
                                        (<i className="fas fa-check" style={{color:"green"}}></i>)
                                         : 
                                        (<i className="fas fa-times" style={{color:"red"}}></i>)
                                        }
                                    </td>
                                    <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant="dark" className="btn-sm rounded confirm"> <i className="fas fa-edit"></i> </Button>
                                    </LinkContainer>
                                    <Button variant="dark" 
                                            className="btn-sm rounded cancel"
                                            onClick={ () => deleteHandler(user._id)}
                                            style={{position:"relative", marginLeft:"1px", marginTop:"1px"}}> <i className="fas fa-trash"></i> </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                 </Table>
                 </>
             )}
        </Container>
             
    )
}

export default UserListScreen
