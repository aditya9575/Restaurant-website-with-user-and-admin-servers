import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context
export const MyContext = createContext();

// Firebase URLs for categories, orders, and users
const firebaseCategoriesUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/categories.json';
const firebaseOrdersUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/customerOrders.json';
const firebaseUsersUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/users.json';

// GlobalContext Provider component
const GlobalContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [dailyOrders, setDailyOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [adminId, setAdminId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  // admin authentication part 
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const expirationTime = sessionStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    if (token && expirationTime && currentTime < expirationTime) {
      setAuthenticated(true); // User is authenticated
    } else {
      setAuthenticated(false); // Token expired or not found
      sessionStorage.clear();  // Clear sessionStorage if token is invalid
    }
  }, []);

  useEffect(() => {
    const storedAdminId = sessionStorage.getItem('userId');
    if (storedAdminId) {
      setAdminId(storedAdminId); // Set the user ID from session storage
    }
  }, []);
  // admin authentication part

  // Fetch orders data from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(firebaseOrdersUrl);
        if (response.data) {
          const ordersData = Object.entries(response.data).flatMap(([userId, userOrders]) =>
            Object.entries(userOrders).map(([orderId, order]) => ({
              orderId,
              userId,
              ...order,
            }))
          );

          setOrders(ordersData);
          calculateTotalSales(ordersData);
          calculateDailyOrders(ordersData);
          calculateActiveOrders(ordersData);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Fetch categories data from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(firebaseCategoriesUrl);
        if (response.data) {
          const categoriesData = Object.entries(response.data).map(([key, value]) => ({
            id: key,
            ...value
          }));
          setCategories(categoriesData);
          console.log('Categories fetched:', categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch users data from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(firebaseUsersUrl);
        if (response.data) {
          const usersData = Object.entries(response.data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setUsers(usersData);
          setTotalUsers(usersData.length);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Calculate total sales
  const calculateTotalSales = (ordersData) => {
    const total = ordersData.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
    setTotalSales(total);
  };

  // Calculate today's orders
  const calculateDailyOrders = (ordersData) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format
    const todayOrders = ordersData.filter(order => order.createdAt && order.createdAt.startsWith(today));
    setDailyOrders(todayOrders.length);
  };

  // Calculate active orders (status: not "delivered" or "rejected")
  const calculateActiveOrders = (ordersData) => {
    const active = ordersData.filter(order => order.status !== 'delivered' && order.status !== 'rejected').length;
    setActiveOrders(active);
  };

  // Function to update order status
  const updateOrderStatus = async (userId, orderId, newStatus) => {
    try {
      await axios.patch(`${firebaseOrdersUrl}/${userId}/${orderId}.json`, { status: newStatus });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
      calculateActiveOrders(orders); // Recalculate active orders after status change
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <MyContext.Provider value={{
      categories,
      setCategories,
      orders,
      users,
      totalSales,
      recipes,
      setRecipes,
      dailyOrders,
      activeOrders,
      totalUsers,
      updateOrderStatus,
      authenticated, 
      setAuthenticated,
      adminId,
    }}>
      {children}
    </MyContext.Provider>
  );
};

export default GlobalContextProvider;
