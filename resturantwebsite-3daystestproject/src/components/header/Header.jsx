import React, { useContext } from "react";
import "./header.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { FaCartShopping } from "react-icons/fa6";
import { GrWorkshop } from "react-icons/gr";
import { IoChatbubblesSharp } from "react-icons/io5";
import { TiArrowBack } from "react-icons/ti";
import { FaUserCircle, FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserGlobalContext";

const Header = () => {
  const navigate = useNavigate();
  
  // Access the cart items from GlobalContext
  const { getTotalItems, setAuthenticated } = useContext(UserContext);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userId');
    setAuthenticated(false);
    sessionStorage.clear();

    navigate('/login'); // Redirect to login
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid className="header-container">
        <TiArrowBack className="back-icon" onClick={() => { navigate("/home") }} />
        <Navbar.Brand href="#" className="mx-auto">Food Genie🍜</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <div className="icon-container">
            {/* Cart icon with total items count */}
            <div className="cart-icon-container" onClick={() => { navigate("/cart") }}>
              <FaCartShopping className="icon cart" />
              <span className="cart-count">{getTotalItems()}</span> {/* Display total items */}
            </div>
            
            <GrWorkshop className="icon orders" onClick={() => { navigate("/myorders") }} />
            <FaUserCircle className="icon user" onClick={() => { navigate("/userprofile") }} />
            <IoChatbubblesSharp className="icon userquery" onClick={() => { navigate("/myquery") }} />
            <FaPowerOff className="icon logout" onClick={handleLogout} />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
