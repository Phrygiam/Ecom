import React from 'react'
import {Container, Row, Col} from "react-bootstrap"

const Footer = () => {
    return (
        <Container className="" style={{position:"relative", marginTop:"5rem"}}>
            <Row>
                <Col className = "text-center py-5"> 
                    <p style={{color:"rgba(255,255,255,.8)"}}>Copyright &copy; Naoss Electronics</p>
                </Col>
            </Row>
        </Container>
    )
}

export default Footer
