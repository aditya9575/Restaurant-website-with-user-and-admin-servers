import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './adminlogin.css';
import { MyContext } from '../../GlobalContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { setAuthenticated } = useContext(MyContext);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
  
    const [error, setError] = useState(''); // State to handle errors
    const [loginSuccess, setLoginSuccess] = useState(false); // State to show login success message
    const [loading, setLoading] = useState(false); // Loader for when login is in progress
  
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
      const { email, password } = formData;
  
      if (!email || !password) {
        return 'All fields are required!';
      }
  
      if (!email.includes('@')) {
        return 'Please enter a valid email address!';
      }
  
      return null; // No errors
    };
  
    // Handle form submission (Login request)
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const errorMessage = validateForm();
      if (errorMessage) {
        setError(errorMessage); // Set error if validation fails
        return;
      }
  
      setError(''); // Clear any previous errors
      setLoading(true); // Show loader
  
      try {
        // Send login request to Firebase Authentication
        const response = await axios.post(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAdhlKGsHhlY4eOQu-K6bsk6cnAi-KpAcY',
          {
            email: formData.email,
            password: formData.password,
            returnSecureToken: true,
          }
        );
  
        const { idToken, localId } = response.data;
  
        // Fetch user details to check email verification status via firebase's getuserdata url
        // This URL allows you to retrieve information about an existing user by sending a request containing the user's ID token.
        const userResponse = await axios.post(
          'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAdhlKGsHhlY4eOQu-K6bsk6cnAi-KpAcY',
          { idToken }
        );
  
        const user = userResponse.data.users[0];
  
        // Check if email is verified
        if (!user.emailVerified) {
          setError('Your email is not verified. Please verify your email before logging in.');
          setLoading(false);
          return;
        }
  
        // Store the token and localId for session management (use sessionStorage for better security in production)
        sessionStorage.setItem('token', idToken);  // Use sessionStorage instead of localStorage for security
        sessionStorage.setItem('adminId', localId); // Store localId for session management
  
        // Optionally, store token expiration time (in seconds)
        const expirationTime = new Date().getTime() + response.data.expiresIn * 1000; // current time + expiration time
        sessionStorage.setItem('tokenExpiration', expirationTime);
        
  
        // Display success message and loader
        setLoginSuccess(true);
  
        // Clear form after successful login
        setFormData({
          email: '',
          password: '',
        });
  
        // Redirect to the homepage after 2 seconds
        setTimeout(() => {
          setAuthenticated(true);
          setLoginSuccess(false);
          navigate('/home', { replace: true });
        }, 2000);
  
  
      } catch (error) {
        console.error('Error logging in:', error);
        setError('Invalid email or password. Please try again.');
      } finally {
        setLoading(false); // Hide loader
      }
    };
  
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            {loginSuccess ? (
              <div className="text-center">
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="sr-only"></span>
                </Spinner>
                <h3>Login success!</h3>
                <p>Redirecting to the home page...</p>
              </div>
            )
            
            
             : (
              <Form className="login-form" onSubmit={handleSubmit}>
                <h1 className="text-center">FoodGenie</h1>
                <h2 className="text-center">Admin Login</h2>
  
                {error && <Alert variant="danger">{error}</Alert>}
  
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="✉️ Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
  
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="🔒 Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
  
                <Button variant="primary" type="submit" className="w-100">
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ml-2">Logging in...</span>
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
  
                <hr />
  
                <div className="text-center">
                  <h4>Don't have an account?</h4>
                  <Link to="/">Sign Up</Link>
                  <br />
                  <Link to="/adminforgotpassword">Forgot Password</Link>
                </div>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    );
};

export default AdminLogin;
