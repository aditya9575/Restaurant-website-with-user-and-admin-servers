import React from 'react';
import './footer.css';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { Link } from 'react-router-dom'; 

const linkedInUrl = "https://www.linkedin.com/in/aditya-m-0bb92b110/";
const twitterUrl = "https://x.com/AdityaMehto3";
const githubUrl = "https://github.com/aditya9575";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h4>About Us</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Col>
          <Col md={4}>
            <h4>Contact Us</h4>
            <p>
              Email: foodgenie@example.com
              <br />
              Phone: +91 12345 67890
            </p>
          </Col>
          <Col md={4}>
            <h4>Follow Us</h4>
            <ul className="social-icons">
              <li>
                <Link to={linkedInUrl} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </Link>
              </li>
              <li>
                <Link to={twitterUrl} target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </Link>
              </li>
              <li>
                <Link to={githubUrl} target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <p className="copyright">© 2023 FoodGenie. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;