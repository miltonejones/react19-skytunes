import React from "react";
import { useNavigate } from "react-router-dom";

function Banner({ title, link, icon }) {
  const navigate = useNavigate();
  return (
    <div className="banner flex align-bottom gap-4">
      <div className="banner-title pl-4">
        {icon} {title}
      </div>{" "}
      {link && (
        <div className="pt-1 link" onClick={() => navigate(link)}>
          View all ➜
        </div>
      )}
    </div>
  );
}

export default Banner;
