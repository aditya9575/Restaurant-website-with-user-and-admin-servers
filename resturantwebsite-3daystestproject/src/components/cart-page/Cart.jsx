import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserGlobalContext";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import "./cart.css";
import Header from "../header/Header";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, userId, addToCart, deleteFromCart } = useContext(UserContext);
  const [userProfileCompleted, setUserProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the user profile completion status on component load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `https://foodgenie-298de-default-rtdb.firebaseio.com/userProfiles/${userId}.json`
        );
        if (response.data && response.data.userProfileCompleted) {
          setUserProfileCompleted(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Function to handle increasing the quantity of a cart item
  const handleAddToCart = (item) => {
    const updatedItem = { ...item, quantity: 1 }; // Increment quantity by 1
    addToCart(updatedItem);
  };

  // Function to handle decreasing the quantity of a cart item
  const handleRemoveFromCart = (item) => {
    if (item.quantity === 1) {
      deleteFromCart(item.id); // If quantity is 1, remove the item from cart
    } else {
      const updatedItem = { ...item, quantity: -1 }; // Decrease quantity by 1
      addToCart(updatedItem); // Use addToCart to update the quantity
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
    <Header/>
    <Container fluid className="d-flex justify-content-center align-items-center cart-wrapper">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm mb-4 cart-container">
            <Card.Body>
              <h2 className="text-center">Your Cart</h2>

              {cart.length === 0 ? (
                <Alert variant="warning" className="text-center">
                  Your cart is currently empty.
                </Alert>
              ) : (
                <>
                  {cart.map((item, index) => (
                    <Card key={index} className="mb-2 cart-item-card">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                          <Card.Title>{item.dishName}</Card.Title>
                          <Card.Text>Price: ₹{item.price}</Card.Text>
                          <Card.Text>Quantity: {item.quantity}</Card.Text>
                        </div>
                        <div className="cart-actions">
                          <Button
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => handleAddToCart(item)}
                          >
                            +
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleRemoveFromCart(item)}
                          >
                            -
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}

                  <div className="cart-total-section mt-3">
                    <h5>Total: ₹{calculateTotal()}</h5>
                    {userProfileCompleted ? (
                      <Button
                        variant="primary"
                        className="mt-3"
                        onClick={() => navigate("/checkout", { state: { cart, userId } })}
                      >
                        Checkout
                      </Button>
                    ) : (
                      <Alert variant="danger" className="mt-3">
                        Please complete your profile to place an order.
                      </Alert>
                    )}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Cart;


