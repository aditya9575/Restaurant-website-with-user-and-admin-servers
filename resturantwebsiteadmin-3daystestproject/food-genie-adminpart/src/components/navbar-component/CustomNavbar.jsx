import React, { useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './customnavbar.css'; // Import custom styles
import { TiArrowBackOutline } from "react-icons/ti";
import { MyContext } from '../../GlobalContext';
import { RiLogoutCircleRFill } from "react-icons/ri";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(MyContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('adminId');
    setAuthenticated(false);
    sessionStorage.clear();

    navigate('/adminlogin'); // Redirect to login
  };

  return (
    <Navbar bg="dark" variant="dark" fixed="top" expand="lg" className="custom-navbar">
      <Container>
        {/* Back Button */}
        <Nav className="me-auto">
          <Nav.Link onClick={() => navigate("/home")}>
            Back <TiArrowBackOutline />
          </Nav.Link>
        </Nav>

        {/* Centered Brand */}
        <Navbar.Brand className="mx-auto">Food Genie🍜</Navbar.Brand>

        {/* Logout Button on the Right */}
        <Nav className="ms-auto">
          <Nav.Link onClick={handleLogout}>
            Logout <RiLogoutCircleRFill />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
