// Card.jsx
import React from "react";
import Logo from "../Logo/Logo";

export default function Card({
  image,
  title,
  caption,
  onClick,
  alt,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      className={[
        "group w-full text-left overflow-hidden rounded-md",
        "bg-white dark:bg-gray-900",
        "shadow-sm ring-1 ring-black/10 dark:ring-white/10",
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
        className,
      ].join(" ")}
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Logo
          src={image}
          alt={alt ?? title}
          fallback="https://www.sky-tunes.com/assets/default_album_cover.jpg"
          style={{ aspectRation: "1/1" }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="truncate mt-1 text-sm text-gray-600 dark:text-gray-300">
          {caption}
        </p>
      </div>
    </button>
  );
}
