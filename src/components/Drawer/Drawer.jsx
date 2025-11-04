import React from "react";
import "./Drawer.css";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";

const Drawer = ({
  drawerOpen,
  onDrawerToggle,
  title,
  css,
  right,
  children,
}) => {
  return (
    <>
      <div
        className={`${drawerOpen ? "drawer open" : "drawer"} ${css || ""} ${
          right ? "right" : "left"
        }`}
      >
        <nav className="bg-gray-600 p-2 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo or App Name */}
            <div className="text-white text-lg font-bold flex align-middle">
              <Logo className="logo-dt" />
              <div>
                <Link to="/">Skytunes</Link>
                <div className="text-xs">{title}</div>
              </div>
            </div>
            <div class="spacer"></div>
            <div onClick={onDrawerToggle}>❌</div>
          </div>
        </nav>
        {/* <div className="drawer-title">{title}</div> */}

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
