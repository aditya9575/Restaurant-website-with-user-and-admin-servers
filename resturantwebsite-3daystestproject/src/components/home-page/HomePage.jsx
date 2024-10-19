import React from "react";
import "./home.css";
import Header from "../header/Header";
import MenuItemsCard from "../menu-display-component/MenuItemsCard";
import Footer from "../footer-component/Footer";

const HomePage = () => {

  return (
    <div>
      <Header />
      <MenuItemsCard />
      <Footer/>
    </div>
  );
};

export default HomePage;





