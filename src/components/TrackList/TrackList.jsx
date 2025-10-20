import { useNavigate } from "react-router-dom";
import Paginator from "../Paginator/Paginator";
import Logo from "../Logo/Logo";
import "./TrackList.css";
import usePlaylist from "../../usePlaylist";
import Drawer from "../Drawer/Drawer";
import { useState } from "react";
import TrackEdit from "../TrackEdit/TrackEdit";
import ArtistBanner from "../ArtistBanner/ArtistBanner";

function formatTime(seconds) {
  if (!seconds || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 1000 / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function TrackList({
  records = [],
  count,
  page = 1,
  onSongSelect,
  handlePageChange,
  currentSongId,
  css,
  showTrackNumbers,
  hidePaginator,
  allowDrag,
  onReorder,
  onUpdate,
  groupByDisc,
  labelName,
  titleName,
  trackCount,
  artistItem,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const trackComplete = () => {
    setSelectedTrack(null);
    onUpdate && onUpdate();
  };

  const handleDragStart = (e, song, index) => {
    setDraggedItem({ song, index });
    e.dataTransfer.setData("text/plain", song.ID);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedItem && draggedItem.index !== dropIndex) {
      const newRecords = [...records];
      const [movedItem] = newRecords.splice(draggedItem.index, 1);
      newRecords.splice(dropIndex, 0, movedItem);

      console.log({ newRecords });

      if (onReorder) {
        onReorder(newRecords, draggedItem.index, dropIndex);
      }
    }

    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const navigate = useNavigate();
  const playlistLib = usePlaylist();
  const matched = records.map((rec) => playlistLib.matchTrack(rec));

  // Group tracks by disc number
  const groupedByDisc = matched.reduce((acc, track) => {
    const discNumber = track.discNumber || 1;
    if (!acc[discNumber]) {
      acc[discNumber] = [];
    }
    acc[discNumber].push(track);
    return acc;
  }, {});

  // Check if we have multiple discs
  const hasMultipleDiscs = groupByDisc && Object.keys(groupedByDisc).length > 1;

  const bannerProps = {
    labelName,
    titleName,
    trackCount,
    artistItem,
  };

  return (
    <>
      {/* [{JSON.stringify(bannerProps)}] */}
      {!!artistItem && <ArtistBanner {...bannerProps} />}
      {!hidePaginator && (
        <Paginator
          onPageClick={handlePageChange}
          count={count}
          currentPage={page || 1}
        />
      )}
      <table className={css || "w-full"}>
        <tbody>
          {Object.entries(groupedByDisc).map(([discNumber, discTracks]) => (
            <>
              {/* Disc header row - only show if multiple discs */}
              {hasMultipleDiscs && (
                <tr key={`disc-${discNumber}`} className="disc-header">
                  <td
                    colSpan="7"
                    className="p-2 font-bold bg-gray-100 border-b"
                  >
                    Disc {discNumber}
                  </td>
                </tr>
              )}
              {/* Track rows for this disc */}
              {discTracks.map((song, index) => {
                // Calculate the global index for drag/drop functionality
                const globalIndex = matched.findIndex(
                  (track) => track.ID === song.ID
                );

                return (
                  <tr
                    key={song.ID}
                    className={`track-row ${css} ${
                      song.FileKey === currentSongId ? "bg-yellow-300" : ""
                    } ${
                      dragOverIndex === globalIndex
                        ? "border-t-blue-900 border-t-2"
                        : ""
                    }`}
                    draggable={!!allowDrag}
                    onDragStart={(e) => handleDragStart(e, song, globalIndex)}
                    onDragOver={(e) => handleDragOver(e, globalIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, globalIndex)}
                    style={{ cursor: "grab" }}
                  >
                    <td className="p-1 info">
                      <Logo
                        src={song.albumImage}
                        alt={song.Title}
                        className={
                          song.FileKey === currentSongId
                            ? "playing-animation"
                            : ""
                        }
                        style={{
                          w: 32,
                          height: 32,
                          borderRadius: "50%",
                        }}
                      />
                    </td>
                    <td>
                      <div className="flex truncate whitespace-nowrap max-w-2xs p-1">
                        <div
                          className="track-caption"
                          onClick={() => playlistLib.openDrawer(song)}
                        >
                          {song.favorite ? "❤️" : "🖤"}
                        </div>
                        {showTrackNumbers && <span>{song.trackNumber}.</span>}{" "}
                        <div
                          className="link"
                          onClick={() => onSongSelect(song, records)}
                        >
                          {song.Title}
                        </div>
                      </div>

                      <div className="track-caption">
                        <div
                          className="link"
                          onClick={() =>
                            navigate(`/artist/detail/${song.artistFk}`)
                          }
                        >
                          {song.artistName}
                        </div>
                        -
                        <div
                          className="link"
                          onClick={() =>
                            navigate(`/album/detail/${song.albumFk}`)
                          }
                        >
                          {song.albumName}
                        </div>
                      </div>
                    </td>
                    <td
                      className="track-detail"
                      onClick={() =>
                        navigate(`/artist/detail/${song.artistFk}`)
                      }
                    >
                      <div className="truncate whitespace-nowrap max-w-2xs p-1">
                        {song.artistName}
                      </div>
                    </td>
                    <td
                      className="track-detail"
                      onClick={() => navigate(`/album/detail/${song.albumFk}`)}
                    >
                      <div className="truncate whitespace-nowrap max-w-2xs p-1">
                        {song.albumName}
                      </div>
                    </td>
                    <td
                      className="track-detail"
                      onClick={() =>
                        navigate(
                          `/genre/detail/${song.Genre.replace("/", "*")}`
                        )
                      }
                    >
                      {song.Genre}
                    </td>

                    <td className="track-detail">
                      {formatTime(song.trackTime)}
                    </td>

                    {playlistLib.enabled && (
                      <td
                        onClick={() => playlistLib.openDrawer(song)}
                        className="track-detail"
                      >
                        {song.favorite ? "❤️" : "🖤"}
                      </td>
                    )}

                    <td className="track-detail icon">
                      <a onClick={() => setSelectedTrack(song)}> ✏️</a>
                    </td>
                  </tr>
                );
              })}
            </>
          ))}
        </tbody>
      </table>
      <Drawer
        title="Track info"
        drawerOpen={!!selectedTrack}
        onDrawerToggle={() => trackComplete()}
        css="wide"
      >
        <TrackEdit
          trackItem={selectedTrack}
          onComplete={() => trackComplete()}
        />
      </Drawer>
      <Drawer
        title="Set playlist"
        drawerOpen={playlistLib.drawerOpen}
        onDrawerToggle={() => playlistLib.setDrawerOpen(false)}
      >
        <div className="p-4">
          {playlistLib.currentTrack?.Title}
          {playlistLib.listItems.map((track) => (
            <div
              key={track.ID}
              className="flex justify-between mb-2 pb-1 border-b border-gray-300 cursor-pointer"
            >
              <div className="font-semibold">{track.Title}</div>
              <div onClick={() => playlistLib.updateList(track)}>
                {" "}
                {playlistLib.matchList(track, playlistLib.currentTrack)
                  ? "❤️"
                  : "🖤"}
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
