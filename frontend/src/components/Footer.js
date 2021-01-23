import React from 'react'
import {Container, Row, Col} from "react-bootstrap"

const Footer = () => {
    return (
        <Container className="mb-5 my-5">
            <Row>
                <Col className = "text-center py-5"> 
                    Copyright &copy; Naoss Electronics
                </Col>
            </Row>
        </Container>
    )
}

export default Footer
