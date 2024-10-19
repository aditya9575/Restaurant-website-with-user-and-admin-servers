import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import Header from '../header/Header';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    landmark: '',
    pincode: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = sessionStorage.getItem('userId'); // Get user ID from session storage

        if (!userId) {
          setError('No user found. Please log in.');
          return;
        }

        // Fetch profile data based on userId
        const response = await axios.get(
          `https://foodgenie-298de-default-rtdb.firebaseio.com/userProfiles/${userId}.json`
        );

        // Check if data exists
        if (response.data) {
          setFormData(response.data); // Set form data with retrieved profile
        } else {
          setError('Complete Your Profile Now'); // Display message if no data
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to fetch profile data. Please try again.');
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(false); // Reset success state

    // Validate input fields (optional)

    try {
      const userId = sessionStorage.getItem('userId'); // Get user ID from session storage

      if (!userId) {
        setError('No user found. Please log in.');
        return;
      }

      // Add userProfileCompleted flag to form data
      const updatedProfileData = {
        ...formData,
        userProfileCompleted: true,
      };

      // PUT request to update profile
      await axios.put(
        `https://foodgenie-298de-default-rtdb.firebaseio.com/userProfiles/${userId}.json`,
        updatedProfileData
      );

      setSuccess(true); // Set success message
    } catch (error) {
      console.error('Error saving profile data:', error);
      setError('Failed to save profile data. Please try again.');
    }
  };

  return (
    <>
    <Header/>
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }} // Full viewport height for centering
    >
      <Card style={{ width: '100%', maxWidth: '500px' }} className="p-4">
        <h2>User Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Profile saved successfully!</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formLandmark">
            <Form.Label>Landmark</Form.Label>
            <Form.Control
              type="text"
              name="landmark"
              placeholder="Enter a nearby landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPincode">
            <Form.Label>Pincode</Form.Label>
            <Form.Control
              type="text"
              name="pincode"
              placeholder="Enter your pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Save Profile
          </Button>
        </Form>
      </Card>
    </Container>
    </>
  );
};

export default UserProfile;


