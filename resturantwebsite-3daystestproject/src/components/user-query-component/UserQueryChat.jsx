// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './userquerychat.css';

// const UserQueryChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get('https://foodgenie-298de-default-rtdb.firebaseio.com/chat'); // Adjust the URL as needed
//         if (response.data) {
//           setMessages(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages(); // Initial fetch

//     const interval = setInterval(fetchMessages, 10000); // Fetch messages every 10 seconds
//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     try {
//       await axios.post('https://foodgenie-298de-default-rtdb.firebaseio.com/chat', {
//         message: inputMessage,
//       });
//       setInputMessage('');
//       // Optionally refetch messages here or wait for the next interval
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <h2>User Query Chat</h2>
//       <div className="messages">
//         {messages.map((msg, index) => (
//           <div key={index} className="message">
//             <p><strong>User:</strong> {msg.message}</p>
//             <p className="timestamp">{new Date(msg.timestamp).toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit} className="chat-form">
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           placeholder="Type your message..."
//           required
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default UserQueryChat;
