import React from "react";
import Logo from "../Logo/Logo";

const HorizCard = ({ title, src, caption, subcaption, onCardClick, half }) => {
  return (
    <div
      className={`flex bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 ${
        half ? "horiz-w" : ""
      }`}
      onClick={onCardClick}
    >
      {/* Image/Logo section - smaller on mobile */}
      <div className="flex-shrink-0">
        <Logo
          src={src}
          alt={title}
          className="w-12 h-12 md:w-24 md:h-24 object-cover rounded-l-lg"
        />
      </div>

      {/* Content section - smaller padding and text on mobile */}
      <div className="p-1 md:p-2 flex-1 truncate">
        <div className="truncate font-semibold text-gray-900 text-xs md:text-sm line-clamp-2 mb-0.5 md:mb-1">
          {title}
        </div>
        <p className="text-gray-700 text-xs md:text-sm mb-0.5 md:mb-1">
          {caption}
        </p>
        <p className="text-gray-500 text-[0.65rem] md:text-xs line-clamp-1 hide-mb">
          {subcaption}
        </p>
      </div>
    </div>
  );
};

export default HorizCard;
