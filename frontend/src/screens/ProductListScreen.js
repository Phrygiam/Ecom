import React, {useEffect} from 'react'
import {LinkContainer} from "react-router-bootstrap"
import {Link} from "react-router-dom"
import {Table, Alert, Button, Container, Row, Col} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Paginate from "../components/Paginate"
import Meta from "../components/Meta"
import {productsSelector, fetchProducts} from "../Redux/Reducers/productsSlice"
import { updateProduct, deleteProduct, getDetailsReset} from "../Redux/Reducers/fetchUpdateProductSlice"
import {logSelector} from "../Redux/Reducers/logSlice"

const ProductListScreen = ({ match, history}) => {

    const pageNumber = match.params.pageNumber || 1
    const dispatch = useDispatch()
    const {loading, hasErrors, errorMessage, productData} = useSelector(productsSelector)
    const logState = useSelector(logSelector)

    const deleteHandler = (id) => {
        if(window.confirm("Are you sure?")) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => {
        dispatch(getDetailsReset())
        history.push("/admin/createProduct")
    }

    const updateProductHandler = (id) => {
        dispatch(getDetailsReset())
        history.push(`/admin/products/${id}/edit`)
    }

    useEffect( () => {
        dispatch(fetchProducts("", pageNumber))
        if(!logState.isLogged) {
            history.push("/login")
        } else if(logState.userInfo && logState.userInfo.isAdmin) {
            // dispatch(fetchProducts("", pageNumber))
        } else if (logState.userInfo && !logState.userInfo.isAdmin) {
            history.push("/")
        }
        
    }, [dispatch, history, logState, pageNumber])
    
    return (
        <Container>
            {loading ? <Loader /> :
             hasErrors ? <Message variant = "danger"> {errorMessage} </Message> :
             logState.isLogged === false ? (<Alert variant = "danger" style={{marginTop: "4rem"}}> You must be logged in as an Admin to view this page <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
             ) : (
                 <>

                 <Meta title="Admin Panel | Products List" />
                 
                 <Row className = "align-items-center">

                     <Col>
                        <h1 className ="my-4" style={{color:"#343a40"}}>Products</h1>
                     </Col>

                     <Col className = "text-right">
                         <Button variant="dark" className = " btn-md my-3 rounded confirm" onClick = {createProductHandler}>
                             <i style ={{position: "relative", marginRight: "8px"}} className = "fas fa-plus"></i>Create Product
                         </Button>
                     </Col>

                 </Row>

                <>
                 <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID: </th>
                            <th>NAME: </th>
                            <th>PRICE: </th>
                            <th>CATEGORY: </th>
                            <th>BRAND:</th>
                        </tr>
                    </thead>
                    <tbody>
                            {productData.products !== undefined && productData.products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td> $ {product.price} </td>
                                    <td> {product.category}</td>
                                    <td> {product.brand}</td>
                                    <td>
                                    
                                    <Button variant="dark" 
                                            className="btn-sm rounded confirm"
                                            onClick = { () => updateProductHandler(product._id)}> <i className="fas fa-edit"></i>
                                    </Button>
                                    
                                    <Button variant="dark" 
                                            className="btn-sm rounded cancel"
                                            onClick={ () => deleteHandler(product._id)}
                                            style={{position:"relative", marginLeft:"1px", marginTop:"1px"}}> <i className="fas fa-trash"></i> </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                 </Table>
                 </>

                 <Paginate page={productData.page} pages={productData.pages} isAdmin = {true}/>
                 </>
             )}
        </Container>
             
    )
}

export default ProductListScreen