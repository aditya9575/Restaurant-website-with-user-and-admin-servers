import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "./sidebar.css";
import { TiMessageTyping } from "react-icons/ti";
import { BiFoodMenu, BiCategoryAlt } from "react-icons/bi";
import { PiChefHatBold } from "react-icons/pi";
import { MdSpaceDashboard } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="sidebar bg-light p-3">
      <Nav defaultActiveKey="/" className="flex-column">
        <Nav.Item>
          <Link to="/" className="nav-link">
            Dashboard
            <MdSpaceDashboard />
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link to="/orders" className="nav-link">
            Manage Orders
            <PiChefHatBold />
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link to="/add-category" className="nav-link">
            Add Categories
            <BiCategoryAlt />
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link to="/add-recipe" className="nav-link">
            Add Recipe
            <BiFoodMenu />
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link to="/userquery" className="nav-link disabled">
            User Query
            <TiMessageTyping />
          </Link>
        </Nav.Item>
        {/* Add more navigation links here */}
      </Nav>
    </div>
  );
};

export default Sidebar;
