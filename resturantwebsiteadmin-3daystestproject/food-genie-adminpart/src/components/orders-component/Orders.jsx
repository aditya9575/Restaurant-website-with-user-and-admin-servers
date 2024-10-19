import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css'; 
import CustomNavbar from '../navbar-component/CustomNavbar';
import Sidebar from '../sidebar-component/Sidebar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    pending: false,
    accepted: false,
    preparing: false,
    outForDelivery: false,
    delivered: false,
    rejected: false,
  });

  const firebaseOrdersUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/customerOrders.json';
  const firebaseUsersUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/userProfiles.json';

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    try {
      const response = await axios.get(firebaseOrdersUrl);
      // Object.entries(response.data) converts the object into an array of [userId, userOrders] pairs, 
      // where userId is the ID of the user, and userOrders is the set of orders for that user.
      // The flatMap method is used to "flatten" the nested arrays into a single array. It takes each order object
      // and adds userId and orderId to it, so each order object now contains both identifiers along with its order details.
      const ordersData = response.data
        ? Object.entries(response.data).flatMap(([userId, userOrders]) =>
            Object.entries(userOrders).map(([orderId, order]) => ({
              userId,
              orderId,
              ...order,
            }))
          )
        : [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch users from Firebase
  const fetchUsers = async () => {
    try {
      const response = await axios.get(firebaseUsersUrl);
      setUsers(response.data || {});
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to update order status
  const updateOrderStatus = async (userId, orderId, status) => {
    try {
      await axios.patch(`https://foodgenie-298de-default-rtdb.firebaseio.com/customerOrders/${userId}/${orderId}.json`, {
        status,
      });
      console.log(`Order ${orderId} updated to ${status}`);
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const renderOrders = (status) => {
    return orders
      .filter((order) => order.status === status)
      .map((order) => {
        const username = users[order.userId]?.fullName || 'Unknown User';
        return (
          <div key={order.orderId} className="order-item">
            <h6>User: {username}</h6>
            <p>Status: {order.status}</p>
            <p>Total Amount: ₹{order.totalAmount}</p>
            <div>
              {order.items.map((item) => (
                <div key={item.id} className="item-details">
                  <h6>{item.dishName}</h6>
                  <img src={item.imageUrl} alt={item.dishName} className="item-image" />
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Veg/Non-Veg: {item.vegOrNonVeg}</p>
                  <p>Ingredients: {item.ingredients.join(', ')}</p>
                  <p>Description: {item.recipeDescription}</p>
                </div>
              ))}
            </div>
            <div>
              {status === 'pending' && (
                <>
                  <button className="action-button" onClick={() => updateOrderStatus(order.userId, order.orderId, 'accepted')}>Accept</button>
                  <button className="action-button" onClick={() => updateOrderStatus(order.userId, order.orderId, 'rejected')}>Reject</button>
                </>
              )}
              {status === 'accepted' && (
                <button className="action-button" onClick={() => updateOrderStatus(order.userId, order.orderId, 'preparing')}>Preparing</button>
              )}
              {status === 'preparing' && (
                <button className="action-button" onClick={() => updateOrderStatus(order.userId, order.orderId, 'out for delivery')}>Out for Delivery</button>
              )}
              {status === 'out for delivery' && (
                <button className="action-button" onClick={() => updateOrderStatus(order.userId, order.orderId, 'delivered')}>Deliver</button>
              )}
            </div>
          </div>
        );
      });
  };

  const toggleSection = (status) => {
    setExpandedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <div>
    <CustomNavbar/>
    <Sidebar/>
    <div className="orders-container">
      <h1>Orders</h1>
      <div className="section">
        <h2 onClick={() => toggleSection('pending')}>Pending Orders {expandedSections.pending ? '▲' : '▼'}</h2>
        {expandedSections.pending && <div>{renderOrders('pending')}</div>}
      </div>
      <div className="section">
        <h2 onClick={() => toggleSection('accepted')}>Accepted Orders {expandedSections.accepted ? '▲' : '▼'}</h2>
        {expandedSections.accepted && <div>{renderOrders('accepted')}</div>}
      </div>
      <div className="section">
        <h2 onClick={() => toggleSection('preparing')}>Preparing Orders {expandedSections.preparing ? '▲' : '▼'}</h2>
        {expandedSections.preparing && <div>{renderOrders('preparing')}</div>}
      </div>
      <div className="section">
        <h2 onClick={() => toggleSection('outForDelivery')}>Out for Delivery Orders {expandedSections.outForDelivery ? '▲' : '▼'}</h2>
        {expandedSections.outForDelivery && <div>{renderOrders('out for delivery')}</div>}
      </div>
      <div className="section">
        <h2 onClick={() => toggleSection('delivered')}>Delivered Orders {expandedSections.delivered ? '▲' : '▼'}</h2>
        {expandedSections.delivered && <div>{renderOrders('delivered')}</div>}
      </div>
      <div className="section">
        <h2 onClick={() => toggleSection('rejected')}>Rejected Orders {expandedSections.rejected ? '▲' : '▼'}</h2>
        {expandedSections.rejected && <div>{renderOrders('rejected')}</div>}
      </div>
    </div>
    </div>
  );
};

export default Orders;
