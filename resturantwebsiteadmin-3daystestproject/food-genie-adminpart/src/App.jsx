import React, { useContext } from "react";
import "./App.css";
import AdminHomePage from "./components/Home-Component/AdminHomePage";
import AddCategoryForm from "./components/add-category-component/AddCategoryForm";
import AddRecipe from "./components/add-recipe-component/AddRecipe";
import Orders from "./components/orders-component/Orders";

import { Routes, Route } from "react-router-dom";
import AdminSignup from "./components/admin-signup-login/AdminSignup";
import AdminLogin from "./components/admin-signup-login/AdminLogin";
import ForgotPassword from "./components/admin-signup-login/ForgotPassword";
import { MyContext } from "./GlobalContext";

const App = () => {
  const { authenticated } = useContext(MyContext);

  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminSignup />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminforgotpassword" element={<ForgotPassword />} />

        {authenticated ? (
          <>
            <Route path="/home" element={<AdminHomePage />} />
            <Route path="/add-category" element={<AddCategoryForm />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/orders" element={<Orders />} />
          </>
        ) : (
          <Route path="*" element={<AdminLogin />} />
        )}
      </Routes>
    </div>
  );
};

export default App;

// dependencies used ->
// npm i react-router-dom
// npm i react-icons
// npm install react-bootstrap bootstrap
// npm i axios
