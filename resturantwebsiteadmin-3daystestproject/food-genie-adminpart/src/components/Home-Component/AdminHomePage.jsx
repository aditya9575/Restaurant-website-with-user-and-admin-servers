import React from 'react';
import Dashboard from '../dashboard-component/Dashboard';
import Sidebar from '../sidebar-component/Sidebar';
import CustomNavbar from '../navbar-component/CustomNavbar';
import './adminHome.css'; 

const AdminHomePage = () => {
  return (
    <div className="admin-home">
      <CustomNavbar /> 
      <Sidebar /> 
      <div className="main-content">
        <Dashboard />
      </div>
    </div>
  );
};

export default AdminHomePage;
