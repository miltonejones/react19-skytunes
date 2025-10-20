import React from "react";

function Banner({ title }) {
  return (
    <div className="banner">
      <h2 className="banner-title pl-4">{title}</h2>
    </div>
  );
}

export default Banner;
