import React, { useContext } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../GlobalContext';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Get context values
  const {
    totalUsers,
    activeOrders,
    totalSales,
    dailyOrders,
    orders,
    users,
    categories,
    recipes,
  } = useContext(MyContext);

  // Calculate total orders placed
  const totalOrders = orders.length; // Number of orders fetched from the context

  // Calculate today's orders
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(order => order.createdAt && order.createdAt.startsWith(today)).length;

  return (
    <div className="dashboard-content p-3">
      <Row>
        <Col md={4}>
          <Card className="mb-4" onClick={() => { navigate("/orders") }}>
            <Card.Body>
              <Card.Title>All Orders</Card.Title>
              <Card.Text>{totalOrders}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Active Orders</Card.Title>
              <Card.Text>{activeOrders}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Customers</Card.Title>
              <Card.Text>{totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Orders Placed</Card.Title>
              <Card.Text>{totalOrders}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Today's Orders</Card.Title>
              <Card.Text>{todaysOrders}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      
    
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <Card.Text>₹ {totalSales.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        </Row>
    </div>
  );
};

export default Dashboard;
