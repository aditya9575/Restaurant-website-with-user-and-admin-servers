import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserGlobalContext"; // Adjust the import path as needed
import axios from "axios";
import "./myorders.css"; // Assuming you have a CSS file for styling

// Importing status icons
import { MdOutlinePendingActions, MdOutlineDeliveryDining } from "react-icons/md"; // pending, out for delivery
import { GiCook, GiCampCookingPot } from "react-icons/gi"; // accepted, preparing
import { TbMoodHappy } from "react-icons/tb"; // delivered
import Header from "../header/Header";

const MyOrders = () => {
  const { userId } = useContext(UserContext); // Adjust based on your context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const response = await axios.get(`https://foodgenie-298de-default-rtdb.firebaseio.com/customerOrders/${userId}.json`);
        if (response.data) {
          const ordersArray = Object.entries(response.data).map(([id, order]) => ({
            id,
            ...order,
          }));
          // Sort the orders by the createdAt timestamp in descending order (latest first)
          const sortedOrders = ordersArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Stop loading after the fetch completes
      }
    };

    fetchOrders();

    // Set an interval to refetch orders every 10 seconds
    const intervalId = setInterval(fetchOrders, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  // Function to map status to the corresponding icon and styling
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <MdOutlinePendingActions className="status-icon pending" title="Pending" />;
      case "accepted":
        return <GiCook className="status-icon accepted" title="Accepted" />;
      case "preparing":
        return <GiCampCookingPot className="status-icon preparing" title="Preparing" />;
      case "out for delivery":
        return <MdOutlineDeliveryDining className="status-icon delivery" title="Out for Delivery" />;
      case "delivered":
        return <TbMoodHappy className="status-icon delivered" title="Delivered" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="my-orders">
        <h2>Your Orders</h2>
        <p className="order-update-note">Note: The order status is updated every 10 seconds. Kindly wait for updates.</p>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet!</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order placed on: {formatDateTime(order.createdAt)}</h3>
                <p>
                  Status: <strong>{order.status}</strong>
                  {getStatusIcon(order.status)}
                </p>
              </div>
              <div className="order-details">
                <h4>Order Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.dishName} - ₹{item.price} (Quantity: {item.quantity})
                    </li>
                  ))}
                </ul>
                <h4>Total Amount: ₹{order.totalAmount}</h4>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;


