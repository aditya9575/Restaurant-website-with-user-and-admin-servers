import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const SignupVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const email = location.state?.email || '';

  const handleInputChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithEmailLink?key=AIzaSyAdhlKGsHhlY4eOQu-K6bsk6cnAi-KpAcY',
        {
          email,
          oobCode: verificationCode
        }
      );
      console.log("Email verified successfully:", response.data);

      // Redirect to login page after successful verification
      navigate("/login");
    } catch (error) {
      console.error("Error verifying email:", error);
      setError("Invalid verification code. Please try again.");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Form onSubmit={handleSubmit}>
            <h2 className="text-center">Verify Your Email</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3" controlId="formVerificationCode">
              <Form.Control
                type="text"
                name="verificationCode"
                placeholder="Enter the OTP sent to your email"
                value={verificationCode}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Verify
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupVerification;
