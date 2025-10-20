import React from "react";
import "./ArtistBanner.css";
import { useNavigate } from "react-router-dom";

const ArtistBanner = ({
  artistItem,
  labelName,
  titleName,
  trackCount,
  clickable,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/artist/detail/${artistItem.ID}`);
  };
  return (
    <div class="artist-outer">
      <img src={artistItem?.imageLg} alt={artistItem?.Name} />

      <div class="info-box">
        <div class="info-label">{labelName}</div>
        <div class="info-title">{titleName}</div>
        <div class="info-caption">{trackCount} tracks in your library</div>
        {clickable && (
          <button className="rounded-b-sm" onClick={handleClick}>
            Open in your library
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtistBanner;
