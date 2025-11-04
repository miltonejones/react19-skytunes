import React, { useEffect, useState } from "react";

function Logo({
  src,
  alt,
  style = {},
  className = "",
  fallback = "https://www.sky-tunes.com/assets/icon-72x72.png",
}) {
  const [source, setSource] = useState(src);
  useEffect(() => {
    const im = new Image();
    im.onload = () => setSource(src);
    im.onerror = () => setSource(fallback);
    im.src = src;
  }, [src]);

  return <img src={source} alt={alt} style={style} className={className} />;
}

export default Logo;
