import React from "react";
import HorizCard from "../HorizCard/HorizCard";
import { useNavigate } from "react-router-dom";

const TrackMenu = ({
  track,
  openPlaylist,
  editTrack,
  addToQueue,
  onDrawerToggle,
  setPhoto,
}) => {
  const navigate = useNavigate();
  if (!track) {
    return <div>No track selected</div>;
  }
  const menu = [
    {
      label: "View Artist",
      caption: track.artistName,
      icon: "🤺",
      action: (song) => navigate(`/artist/detail/${song.artistFk}`),
    },
    {
      label: "View Album",
      caption: track.albumName,
      icon: "📀",
      action: (song) => navigate(`/album/detail/${song.albumFk}`),
    },
    {
      label: "View Genre",
      caption: track.Genre,
      icon: "🏷",
      action: (song) =>
        navigate(`/genre/detail/${song.Genre.replace(/\//g, "*")}`),
    },
    {
      label: "Edit Track",
      caption: "Modify track details",
      icon: "✏️",
      action: editTrack,
    },
    {
      label: "Add to Queue",
      caption: "Play this song next",
      icon: "🎵",
      action: addToQueue,
    },
    {
      label: "Add to Playlist",
      caption: "Add this song to a playlist",
      icon: "➕",
      action: openPlaylist,
    },
  ];

  if (setPhoto) {
    menu.push({
      label: "Update Playlist thumbnail",
      caption: "Set playlist thumbnail to this song artwork",
      icon: "🖼",
      action: setPhoto,
    });
  }

  const handleClick = (action) => {
    action(track);
    onDrawerToggle();
  };

  return (
    <>
      <HorizCard
        title={track?.Title}
        src={track?.albumImage}
        caption={track?.artistName}
        subcaption={track?.albumName}
      />
      <div className="p-2">
        {menu.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item.action)}
            className=" mb-2 pb-1 border-b border-gray-300 cursor-pointer"
          >
            {item.icon} {item.label}
            <div className="pl-6 text-sm text-gray-600">{item.caption}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TrackMenu;
