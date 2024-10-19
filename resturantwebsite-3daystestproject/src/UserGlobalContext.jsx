import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context
export const UserContext = createContext();

// GlobalContext Provider component
const GlobalContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const [orderPlaced , setOrderPlaced] = useState(false);

// This checks if the user’s session (stored in sessionStorage) is still valid by comparing the token expiration time
// with the current time.
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

  // Retrieve the userId from sessionStorage. Fetch the cart items from Firebase for that user if the userId is found.
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId); // Set the user ID from session storage
      fetchCartItems(storedUserId); // Fetch initial cart items
    }
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(`https://foodgenie-298de-default-rtdb.firebaseio.com/userCartItems/${userId}.json`);
      const items = response.data ? Object.entries(response.data).map(([firebaseId, item]) => ({ firebaseId, ...item })) : [];
      setCart(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const updateCartInFirebase = async (updatedCart) => {
    const promises = updatedCart.map(item =>
      axios.put(`https://foodgenie-298de-default-rtdb.firebaseio.com/userCartItems/${userId}/${item.firebaseId}.json`, { ...item })
    );
    await Promise.all(promises);
  };

  // If Item Already Exists: If the item is already in the cart, it updates the quantity by adding the new quantity to the
  //  existing quantity.If Item is New: If the item does not exist in the cart, it sends a POST request to Firebase to add 
  // the item and then updates the local cart with the new item.
  const addToCart = async (item) => {
    try {
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists in cart, update its quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        setCart(updatedCart);

        // Update Firebase with the new quantity
        await updateCartInFirebase(updatedCart);
      } else {
        // Item does not exist, add it to the cart
        const newItem = { ...item, quantity: item.quantity || 1 };
        const response = await axios.post(`https://foodgenie-298de-default-rtdb.firebaseio.com/userCartItems/${userId}.json`, newItem);

        // Firebase response includes the unique id (name)
        const firebaseId = response.data.name;
        setCart(prevCart => [...prevCart, { ...newItem, firebaseId }]);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const deleteFromCart = async (itemId) => {
    try {
      // Find the item in the cart
      const itemToDelete = cart.find(item => item.id === itemId);

      if (itemToDelete && itemToDelete.firebaseId) {
        // Delete the item from Firebase using its firebaseId
        await axios.delete(`https://foodgenie-298de-default-rtdb.firebaseio.com/userCartItems/${userId}/${itemToDelete.firebaseId}.json`);

        // Update local state after deletion
        const updatedCart = cart.filter(item => item.id !== itemId);
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  // Clear cart function to remove all items from Firebase and local state
  const clearCart = async () => {
    try {
      // Clear cart from Firebase
      await axios.delete(`https://foodgenie-298de-default-rtdb.firebaseio.com/userCartItems/${userId}.json`);

      // Clear local cart state
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Place order function
  const placeOrder = async () => {
    try {
      const order = {
        userId,
        items: cart,
        totalAmount: calculateTotalAmount(),
        status: 'pending', // Initial status for the order
        createdAt: new Date().toISOString(),
      };

      // Add order to "customerOrders" collection in Firebase
      await axios.post(`https://foodgenie-298de-default-rtdb.firebaseio.com/customerOrders/${userId}.json`, order);

      // Clear the cart after placing the order
      await clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.length; // Total unique items in cart
  };

  return (
    <UserContext.Provider value={{ authenticated, setAuthenticated, cart, addToCart, deleteFromCart, userId, calculateTotalAmount
    , getTotalItems, clearCart, placeOrder , orderPlaced , setOrderPlaced }}>
      {children}
    </UserContext.Provider>
  );
};

export default GlobalContextProvider;



