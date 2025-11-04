import React from "react";
import "./ToastButton.css";

const ToastButton = ({ icon, className, toastIcon, onClick, children }) => {
  const [active, setActive] = React.useState(false);

  const handleClick = () => {
    onClick && onClick();
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 3999);
  };
  return (
    <>
      <div onClick={handleClick} className={className}>
        {!active ? icon : toastIcon}
      </div>
      <div className={active ? "toast active" : "toast"}>{children}</div>
    </>
  );
};

export default ToastButton;
