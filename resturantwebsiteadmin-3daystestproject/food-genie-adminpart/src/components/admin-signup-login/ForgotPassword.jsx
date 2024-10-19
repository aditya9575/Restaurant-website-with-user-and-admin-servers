import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './forgotpassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Handle input change for email
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  // Validate form (email input)
  const validateForm = () => {
    if (!email) {
      return 'Email is required!';
    }
    if (!email.includes('@')) {
      return 'Please enter a valid email address!';
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage); // Set error if validation fails
      return;
    }

    setError(''); // Clear any previous errors

    try {
      const response = await axios.post(
        'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAdhlKGsHhlY4eOQu-K6bsk6cnAi-KpAcY',
        {
          requestType: 'PASSWORD_RESET',
          email: email,
        }
      );

      console.log('Password reset email sent:', response.data);

      // Show success message
      setResetEmailSent(true);

      // Clear the email field after successful request
      setEmail('');

    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError('Error sending reset email. Please try again.');
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Form className="forgot-password-form" onSubmit={handleSubmit}>
            <h1 className="text-center">FoodGenie</h1>
            <h2 className="text-center">Forgot Password</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {resetEmailSent && (
              <Alert variant="success">
                Password reset link sent to your email.
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Control
                type="email"
                name="email"
                placeholder="✉️ Enter your registered email"
                value={email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Reset Password
            </Button>

            <Button variant="secondary" className="w-100 mt-3" onClick={() => navigate(-1)}>
              Back to Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
