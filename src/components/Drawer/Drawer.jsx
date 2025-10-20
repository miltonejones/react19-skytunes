import React from "react";
import "./Drawer.css";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";

const Drawer = ({ drawerOpen, onDrawerToggle, title, css, children }) => {
  return (
    <>
      <div className={`${drawerOpen ? "drawer open" : "drawer"} ${css || ""}`}>
        <nav className="bg-gray-600 p-4 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo or App Name */}
            <div className="text-white text-xl font-bold flex align-middle">
              <Logo className="logo-dt" />
              <Link to="/">Skytunes</Link>
            </div>
            <div class="spacer"></div>
            <div onClick={onDrawerToggle}>❌</div>
          </div>
        </nav>
        <div>{title}</div>

        {/*     
        <div class="close-button">
          <div class="spacer"></div>
          <div onClick={onDrawerToggle}>❌</div>
        </div> */}

        {children}
      </div>

      {drawerOpen && <div class="backdrop" onClick={onDrawerToggle}></div>}
    </>
  );
};

export default Drawer;
