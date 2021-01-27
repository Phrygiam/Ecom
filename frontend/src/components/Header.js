import React from 'react'
import {Container, Navbar, Nav, Dropdown} from "react-bootstrap"
import {LinkContainer} from "react-router-bootstrap"
import {logSelector, login} from "../Redux/Reducers/logSlice"
import {useSelector, useDispatch} from "react-redux"
import {Route} from "react-router-dom"
import Searchbar from "./Searchbar"

const Header = ({history}) => {

    const log = useSelector(logSelector)
    const dispatch = useDispatch()

    const logout = () => {
        dispatch(login())
    }
    
    return (
        <header>
            <Navbar bg="dark" variant = "dark" expand="lg" collapseOnSelect>

                <Container>

                    <LinkContainer to = '/'>
                    <Navbar.Brand>Naoss Electronics</Navbar.Brand>
                    </LinkContainer>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">

                    <Route render={ ({history}) => <Searchbar history={history}/>} />

                    <Nav className="ml-auto">

                        {log.isLogged && <h5 style={{marginTop:"0.8rem", marginRight:"5rem", bottom:"20px", color:"rgba(255,255,255,0.8)"}}> Welcome, {log.userInfo.name}! </h5>}

                        

                        {!log.isLogged && ( <>
                            <LinkContainer to = '/cart' className="navCart">
                                <Nav.Link> <i className = "fas fa-shopping-cart"></i> Cart </Nav.Link>
                            </LinkContainer>
                        
                        
                            <LinkContainer to = '/login'>
                                <Nav.Link> <i className = "fas fa-user"></i> Sign in </Nav.Link>
                            </LinkContainer>
                        </> ) }
                        
                        
                        
                        {log.isLogged && !log.userInfo.isAdmin &&
                            <Dropdown className="navDropdown">
                                <Dropdown.Toggle className="navButton" id="dropdown-basic-button" title="Dropdown button" style={{backgroundColor:"#343a40"}}> {log.userInfo.name}
                                    <Dropdown.Menu show style={{backgroundColor:"#343a40"}}>

                                        <LinkContainer to = '/cart'>
                                            <Dropdown.Item inactive="true" className="navLink"><i className = "fas fa-shopping-cart"></i> Cart </Dropdown.Item>
                                        </LinkContainer>

                                        <LinkContainer to='/profile'>
                                            <Dropdown.Item  className="navLink"><i className = "fas fa-user"></i> Profile </Dropdown.Item>
                                        </LinkContainer>

                                        <Dropdown.Item  onClick={logout} className="navLink"><i className="fas fa-sign-out-alt"></i> Log Out </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown.Toggle>
                            </Dropdown>
                        }

                        {log.userInfo.isAdmin &&
                            <Dropdown className="navDropdown">
                                <Dropdown.Toggle className="navButton" id="dropdown-basic-button" title="Dropdown button" style={{backgroundColor:"#343a40"}}> {log.userInfo.name}
                                    <Dropdown.Menu show style={{backgroundColor:"#343a40"}}>

                                        <LinkContainer to='/admin/userList'>
                                            <Dropdown.Item className="navLink">
                                                <i className = "fas fa-users"></i>
                                                <span className ="dropdownSpan">Users</span>
                                            </Dropdown.Item>
                                        </LinkContainer>

                                        <LinkContainer to='/admin/productList'>
                                            <Dropdown.Item className="navLink">
                                                <i className = "fas fa-tags"></i>
                                                <span className ="dropdownSpan">Products</span>
                                            </Dropdown.Item>
                                        </LinkContainer>

                                        <LinkContainer to='/admin/orderList'>
                                            <Dropdown.Item className="navLink">
                                                <i className="fas fa-edit"></i>
                                                <span className ="dropdownSpan">Orders</span>
                                            </Dropdown.Item>
                                        </LinkContainer>

                                        <Dropdown.Item onClick={logout} className="navLink">
                                            <i className="fas fa-sign-out-alt"></i>
                                            <span className ="dropdownSpan">Log Out</span>
                                         </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown.Toggle>
                            </Dropdown>
                        }
                        
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
