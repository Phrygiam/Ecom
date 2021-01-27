import React, {useEffect} from 'react'
import {LinkContainer} from "react-router-bootstrap"
import {Table, Alert, Button, Container} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import Loader from "../components/Loader"
import Meta from "../components/Meta"
import {fetchOrderListSelector, listAllOrders} from "../Redux/Reducers/fetchOrderListSlice"
import {logSelector} from "../Redux/Reducers/logSlice"


const OrderListScreen = ({history}) => {

    const dispatch = useDispatch()
    const {listLoading, listHasErrors, listMessage, orderList} = useSelector(fetchOrderListSelector)
    const logState = useSelector(logSelector)
    const log = useSelector(logSelector)

    useEffect( () => {
        if(!logState.isLogged) {
            history.push("/login")
        } else if(logState.userInfo && logState.userInfo.isAdmin) {
            let token = log.userInfo.token
            dispatch(listAllOrders(token))
        } else if (logState.userInfo && !logState.userInfo.isAdmin) {
            history.push("/")
        }
        
    }, [dispatch, history, logState])

    return (
        <Container>
            {listLoading ? <Loader /> :
             listHasErrors ? <Alert variant = "danger" style={{top:"4rem"}}> {listMessage} </Alert> : (
                 <>
                 
                 <Meta title ="Admin Panel | Order List" />

                 <h1 className ="ivory" style={{position:"relative", top:"2rem"}}> Users </h1>
                 <Table striped bordered hover responsive className="my-5 table-sm ivory">
                    <thead>
                        <tr>
                            <th>ID: </th>
                            <th>USER: </th>
                            <th>DATE: </th>
                            <th>TOTAL: </th>
                            <th>PAID: </th>
                            <th>DELIVERED: </th>
                        </tr>
                    </thead>
                    <tbody>
                            {orderList.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user && order.user.name}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.isPaid ? (
                                        order.paidAt.substring(0, 10)
                                    ) : (
                                        <i className="fas fa-times" style={{color:"red"}}></i>
                                    )}
                                    </td>
                                    <td>{order.isDelivered ? (
                                        order.deliveredAt.substring(0, 10)
                                    ) : (
                                        <i className="fas fa-times" style={{color:"red"}}></i>
                                    )}
                                    </td>
                                    <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant="dark" className="btn-sm rounded confirm"> Details </Button>
                                    </LinkContainer>
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

export default OrderListScreen
