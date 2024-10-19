
import React, { useContext } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import SignupComponent from './components/signup-page/SignupComponent';
import LoginComponent from './components/login-page/LoginComponent';
import SignupVerification from './components/signup-verification/SignupVerification';
import HomePage from './components/home-page/HomePage';
import ForgotPassword from './components/forgot-password-page/ForgotPassword';
import UserProfile from './components/user-profile-page/UserProfile';
import Cart from './components/cart-page/Cart';
import FinalCheckout from './components/payment-method-component/FinalCheckout';
import MyOrders from './components/my-orders-component/MyOrders';
// import UserQueryChat from './components/user-query-component/UserQueryChat';
import { UserContext } from './UserGlobalContext';

const App = () => {

  const{authenticated} = useContext(UserContext);


  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<SignupComponent />} />
        <Route path='/login' element={<LoginComponent />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/signupverification' element={<SignupVerification />} />

        {/* Protected Routes (only accessible when authenticated) */}
        {authenticated ? (
          <>
            <Route path="/home" element={<HomePage  />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/checkout' element={<FinalCheckout />} />
            <Route path='/myorders' element={<MyOrders/>} />
            {/* <Route path='/myquery' element={<UserQueryChat/>} /> */}
          </>
        ) : (
          <Route path="*" element={<LoginComponent />} /> // Redirect to login if not authenticated
        )}
        
       
      </Routes>
    </div>
  );
};

export default App;



// dependencies used 
// npm install react-bootstrap bootstrap
// npm i react-icons
// npm i react-router-dom
// npm i axios
// npm install @reduxjs/toolkit react-redux
// npm install nodemailer




