import React from "react";
import Logo from "../Logo/Logo";

const HorizCard = ({ title, src, caption, subcaption, onCardClick }) => {
  return (
    <div
      className="flex bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={onCardClick}
    >
      <div className="flex-shrink-0">
        <Logo
          src={src}
          alt={title}
          className="w-24 h-24 object-cover rounded-l-lg"
        />
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-gray-700 text-sm mb-1">{caption}</p>
        <p className="text-gray-500 text-xs line-clamp-1">{subcaption}</p>
      </div>
    </div>
  );
};

export default HorizCard;
