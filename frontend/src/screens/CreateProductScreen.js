import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import {Button, Form, Container, Alert, Image, Col, Row} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../components/Loader"
import Message from "../components/Message"
import Meta from "../components/Meta"
import {createProduct, getDetailsReset, detailsSelector} from "../Redux/Reducers/fetchUpdateProductSlice"
import {logSelector} from "../Redux/Reducers/logSlice"
import axios from "axios"

const CreateProductScreen = ({ history }) => {

    const dispatch = useDispatch()
    const {loading, errorMessage, createErrorMessage, successMessage} = useSelector(detailsSelector)
    const logState = useSelector(logSelector)

    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [price, setPrice] = useState("")
    const [brand, setBrand] = useState("")
    const [category, setCategory] = useState("")
    const [countInStock,setCountInStock] = useState("")
    const [description, setDescription] = useState("")
    const [uploading, setUploading] = useState(false)
    const [uploadingError, setUploadingError] = useState("")

    const submitHandler = (e) => {
        e.preventDefault()      
        dispatch(createProduct(name, image, brand, category, countInStock, description, price))   
    }

    const uploadFileHandler = async(e) => {
        e.preventDefault()
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image", file)
        setUploading(true)

        try {

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

            const {data} = await axios.post("/api/upload", formData, config)
            setUploadingError("")
            setImage(data)
            setUploading(false)
            
        } catch (error) {
            console.error(error)
            setUploadingError("Images only")
            setUploading(false)
        }
    }

    useEffect( () => {
        dispatch(getDetailsReset())
    },[dispatch])

        
        

    

    return (
        <Container className="d-flex flex-column align-items-center" >

            <Meta title="Naoss Electronics | Create Product" />
            
            {loading ? <Loader /> :  errorMessage.length !== 0 ? <Alert variant = "danger" style={{top:"4rem"}}> {errorMessage} </Alert> : 
            logState.isLogged === false ?
            <Alert variant = "danger" style={{top: "4rem"}}> You must be logged in as an Admin to view this page <Link to="/login" style={{marginLeft:"2rem"}}>Log in</Link> </Alert>
            :
            successMessage.length !==0 ? <Alert variant = "success" style={{marginTop: "4rem"}}> {successMessage} <Link to="/admin/productList" style={{marginLeft:"2rem"}}>Go back</Link> </Alert>
            :
            <>
                <Link to ='/admin/productList'>
                    <Button className = "btn-dark my-3 confirm rounded">Go Back</Button>
                </Link>
    
                <h1 className="my-5 ivory">Create Product</h1>

                <Form onSubmit={submitHandler}>

                    <Row>

                        <Col md={5} style={{margin:"auto"}}>
                            <Row className="d-flex flex-column align-items-center">
                                <Form.Group controlId="image" >
                                    <Form.Label className="d-flex flex-column align-items-center ivory">Image Path</Form.Label>
                                    <Form.Control type="text" placeholder="enter image path" value={image} onChange={ (e)=> setImage(e.target.value)}></Form.Control>
                                    <Form.File id="image-file" label="Choose file" custom onChange={uploadFileHandler} style={{marginTop:"10px"}}></Form.File>
                                    {uploading && <Loader />}
                                </Form.Group>
                                {createErrorMessage.includes("image") && <Message variant = "danger"> Image path is required </Message>}
                                {uploadingError.length !==0 && <Message variant = "danger"> {uploadingError} </Message>}
                            </Row>
                            <Row>
                                <Image src = {image} alt = {image} style={{border:"1px solid darkorange", borderRadius:"6px"}} fluid></Image>
                            </Row>
                            
                        </Col>     
                        
                        <Col md={5} style={{margin:"auto"}}>
                            <Form.Group controlId="description" >
                                <Form.Label className="d-flex flex-column align-items-center ivory">Description</Form.Label>
                                <Form.Control as="textarea" rows="5" placeholder="Enter description..." value={description} onChange={ (e)=> setDescription(e.target.value)}></Form.Control>
                                {createErrorMessage.includes("description") && <Message variant = "danger"> Description is required </Message>}
                            </Form.Group>
                        </Col>

                        <Col md={5} style={{margin:"auto", marginTop:"4rem"}}>
                            <Form.Group controlId="name" >
                                <Form.Label className="d-flex flex-column align-items-center ivory">Name</Form.Label>
                                <Form.Control type="text" placeholder="enter name" value={name} onChange={ (e)=> setName(e.target.value)}></Form.Control>
                                {createErrorMessage.includes("name") && <Message variant = "danger"> Name is required </Message>}
                            </Form.Group>

                            <Form.Group controlId="brand" >
                                <Form.Label className="d-flex flex-column align-items-center ivory">Brand</Form.Label>
                                <Form.Control type="text" placeholder="enter brand" value={brand} onChange={ (e)=> setBrand(e.target.value)}></Form.Control>
                                {createErrorMessage.includes("brand") && <Message variant = "danger"> Brand is required </Message>}
                            </Form.Group>
                        </Col>

                        <Col md={5} style={{margin:"auto", marginTop:"4rem"}}>
                            <Form.Group controlId="category" >
                                <Form.Label className="d-flex flex-column align-items-center ivory">Category</Form.Label>
                                <Form.Control type="text" placeholder="enter category" value={category} onChange={ (e)=> setCategory(e.target.value)}></Form.Control>
                                {createErrorMessage.includes("category") && <Message variant = "danger"> Category is required </Message>}
                            </Form.Group>

                            <Form.Group controlId="countInStock" >
                                <Form.Label className="d-flex flex-column align-items-center ivory">Products in stock</Form.Label>
                                <Form.Control type="number" placeholder="enter count in stock" value={countInStock} onChange={ (e)=> setCountInStock(e.target.value)}></Form.Control>
                                {createErrorMessage.includes("countInStock") && <Message variant = "danger"> Amount required </Message>}
                            </Form.Group>
                        </Col>
                      
                    </Row>

                    <Row className="d-flex flex-column align-items-center">
                        <Col md={3}  style={{margin:"auto", marginTop:"2rem"}}>
                            <Form.Group controlId="price" >
                                <Form.Label className="d-flex flex-column align-items-center ivory"> $ Price</Form.Label>
                                <Form.Control type="number" placeholder="enter price per unit" value={price} onChange={ (e)=> setPrice(e.target.value)}></Form.Control>
                                {createErrorMessage.includes("price") && <Message variant = "danger"> Price is required </Message>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="d-flex flex-column align-items-center"> 
                        <Col md={3} className="d-flex flex-column align-items-center" style={{margin:"auto", marginTop:"2rem"}}>
                            <Button type="submit" className="btn-block btn-dark confirm rounded" size="md">Create</Button>
                        </Col>
                    </Row>

                </Form>    
            </>
            }

        </Container>
    )
}

export default CreateProductScreen
