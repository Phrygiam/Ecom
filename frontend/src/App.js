import React from 'react';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Social from "./components/Social"
import HomeScreen from "./screens/HomeScreen"
import ProductScreen from "./screens/ProductScreen"
import CartScreen from "./screens/CartScreen"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import ProfileScreen from "./screens/ProfileScreen"
import ShippingScreen from "./screens/ShippingScreen"
import PaymentScreen from "./screens/PaymentScreen"
import PlaceOrderScreen from "./screens/PlaceOrderScreen"
import OrderScreen from "./screens/OrderScreen"
import UserListScreen from "./screens/UserListScreen"
import UserEditScreen from "./screens/UserEditScreen"
import ProductListScreen from "./screens/ProductListScreen"
import ProductReviewScreen from "./screens/ProductReviewScreen"
import CreateProductScreen from "./screens/CreateProductScreen"
import UpdateProductScreen from "./screens/UpdateProductScreen"
import OrderListScreen from "./screens/OrderListScreen"
import {Container} from "react-bootstrap"
import {BrowserRouter as Router, Route} from "react-router-dom"

function App() {
  return (
    <Router>
      <Header />
      <Social />
      
         <Container className="wrapper">

          <Container>
            <Route path ='/' component = {HomeScreen} exact />
            <Route path ='/admin/userList' component = {UserListScreen} />
            <Route path ='/admin/user/:id/edit' component = {UserEditScreen} />
            <Route path ='/admin/productList' component = {ProductListScreen} exact/>
            <Route path ='/admin/productList/:pageNumber' component = {ProductListScreen} exact/>
            <Route path ='/admin/createProduct' component = {CreateProductScreen} />
            <Route path ='/admin/products/:id/edit' component = {UpdateProductScreen} />
            <Route path ='/login' component = {LoginScreen} />
            <Route path ='/profile' component = {ProfileScreen} />
            <Route path ='/register' component = {RegisterScreen} />
            <Route path ='/shipping' component = {ShippingScreen} />
            <Route path ='/payment' component = {PaymentScreen} />
            <Route path ='/placeorder' component = {PlaceOrderScreen} />
            <Route path ='/order/:id' component = {OrderScreen} />
            <Route path ='/admin/orderList' component = {OrderListScreen} />
            <Route path ='/product/:id' component = {ProductScreen} />
            <Route path ='/products/:id/reviews' component={ProductReviewScreen} />
            <Route path ='/cart/:id?' component = {CartScreen} />
            <Route path ='/page/:pageNumber' component={HomeScreen} />        
            <Route path ='/search/:keyword' component={HomeScreen} exact/>
            <Route path ='/search/:keyword/page/:pageNumber' component={HomeScreen} />
          </Container>

        <Footer />   
  
      </Container>
    </Router>
  );
}

export default App;
