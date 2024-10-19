import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './adminsignup.css';


const AdminSignup = () => {

    const [formData, setFormData] = useState({
        mobileNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    
      const [error, setError] = useState(''); // State to handle errors
      const [verificationSent, setVerificationSent] = useState(false); // To show the verification message
    
      // Handle form input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
    
      // Validate form inputs
      const validateForm = () => {
        const {  mobileNumber, email, password, confirmPassword } = formData;
    
        if ( !mobileNumber || !email || !password || !confirmPassword) {
          return 'All fields are required!';
        }
    
        if (!email.includes('@')) {
          return 'Please enter a valid email address!';
        }
    
        if (password !== confirmPassword) {
          return 'Passwords do not match!';
        }
    
        return null; // No errors
      };
    
      // Store user data in Firebase Realtime Database
      const storeUserData = async (data) => {
        try {
          await axios.post('https://foodgenie-298de-default-rtdb.firebaseio.com/admins.json', data);
          console.log('Admin data stored successfully');
        } catch (error) {
          console.error('Error storing user data:', error);
        }
      };
    
      // Send email verification request
      const sendEmailVerification = async (idToken) => {
        try {
          await axios.post(
            'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAdhlKGsHhlY4eOQu-K6bsk6cnAi-KpAcY',
            {
              requestType: 'VERIFY_EMAIL',
              idToken: idToken,
            }
          );
          console.log('Email verification sent');
        } catch (error) {
          console.error('Error sending email verification:', error);
          setError('Error sending verification email. Please try again.');
        }
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const errorMessage = validateForm();
        if (errorMessage) {
          setError(errorMessage); // Set error if validation fails
          return;
        }
    
        setError(''); // Clear errors if validation passes
    
        try {
          // Sign up user with Google Identity Toolkit
          const signUpResponse = await axios.post(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAdhlKGsHhlY4eOQu-K6bsk6cnAi-KpAcY',
            {
              email: formData.email,
              password: formData.password,
              returnSecureToken: true,
            }
          );
    
          const { idToken, localId } = signUpResponse.data;
    
          // Store user data in Firebase Database
          await storeUserData({
            mobileNumber: formData.mobileNumber,
            email: formData.email,
            userId: localId,
          });
    
          // Send email verification
          await sendEmailVerification(idToken);
    
          // Show verification message
          setVerificationSent(true);
    
          // Clear form after successful signup
          setFormData({
            mobileNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
    
          // Automatically hide the verification message after 5 seconds
          setTimeout(() => setVerificationSent(false), 10000);
    
        } catch (error) {
          console.error('Error during signup:', error);
          setError('Error signing up. Please try again.');
        }
      };
    
      return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Row className="w-100 justify-content-center">
            <Col md={6} lg={4}>
              <Form className="signup-form" onSubmit={handleSubmit}>
                <h1 className="text-center">FoodGenie🍜</h1>
                <h2 className="text-center">Admin Signup</h2>
    
                {error && <Alert variant="danger">{error}</Alert>}
    
                {verificationSent && (
                  <Alert variant="warning">
                    Verify your email for successful signup. Please check your inbox.
                  </Alert>
                )}
    
    
                <Form.Group className="mb-3" controlId="formMobileNumber">
                  <Form.Control
                    type="tel"
                    name="mobileNumber"
                    placeholder="📞 Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="✉️ Enter Mail Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="🔒 Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="🔒 Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
    
                <Button variant="primary" type="submit" className="w-100">
                  Signup
                </Button>
    
                <hr />
    
                <div className="text-center">
                  <h4>Already have an account?</h4>
                  <Link to="/adminlogin">Login</Link>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      );
};

export default AdminSignup;
