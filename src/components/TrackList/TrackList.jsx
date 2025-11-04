import { useNavigate } from "react-router-dom";
import Paginator from "../Paginator/Paginator";
import Logo from "../Logo/Logo";
import "./TrackList.css";
import usePlaylist from "../../usePlaylist";
import Drawer from "../Drawer/Drawer";
import { useState } from "react";
import TrackEdit from "../TrackEdit/TrackEdit";
import ArtistBanner from "../ArtistBanner/ArtistBanner";
import ToastButton from "../ToastButton/ToastButton";
import TrackMenu from "../TrackMenu/TrackMenu";
import HorizCard from "../HorizCard/HorizCard";

function formatTime(seconds) {
  if (!seconds || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 1000 / 60);
  const remainingSeconds = Math.floor((seconds / 1000) % 60);

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
  setPhoto,
  onSongInsert,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [editedTrack, setEditedTrack] = useState(null);

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
                          aspectRatio: "1 / 1",
                          borderRadius: "50%",
                        }}
                      />
                    </td>
                    <td>
                      <div className="flex truncate whitespace-nowrap p-1">
                        <div
                          className="track-caption"
                          onClick={() => playlistLib.openDrawer(song)}
                        >
                          {song.favorite ? "❤️" : "🖤"}
                        </div>
                        {showTrackNumbers && <span>{song.trackNumber}.</span>}{" "}
                        <div
                          className="link truncate whitespace-nowrap max-w-2xs"
                          onClick={() => onSongSelect(song, records)}
                        >
                          {song.Title}
                        </div>
                        <div className="spacer"></div>
                        {/* <ToastButton
                          onClick={() => onSongInsert(song)}
                          className="link track-caption"
                          icon="➕"
                          toastIcon="✔️"
                        >
                          {song.Title} added to queue
                        </ToastButton> */}
                        <a
                          onClick={() => setEditedTrack(song)}
                          className="link track-caption pr-2"
                        >
                          {" "}
                          ☰
                        </a>
                      </div>

                      <div className="track-caption detail">
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
                      <a onClick={() => setEditedTrack(song)}> ☰</a>
                    </td>

                    {/* {setPhoto && (
                      <td className="track-detail icon">
                        <ToastButton
                          onClick={() => setPhoto(song)}
                          className="link"
                          icon="🖼"
                          toastIcon="✔️"
                        >
                          Playlist thumbnail updated to "{song.Title}"
                        </ToastButton>
 
                      </td>
                    )} */}

                    {/* <td className="track-detail">
                      <ToastButton
                        onClick={() => onSongInsert(song)}
                        className="link"
                        icon="➕"
                        toastIcon="✔️"
                      >
                        {song.Title} added to queue
                      </ToastButton>
                    </td> */}
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
        right
        title="Track menu"
        drawerOpen={!!editedTrack}
        onDrawerToggle={() => setEditedTrack(null)}
      >
        <TrackMenu
          openPlaylist={(song) => playlistLib.openDrawer(song)}
          editTrack={(song) => setSelectedTrack(song)}
          addToQueue={(song) => onSongInsert(song)}
          onDrawerToggle={() => setEditedTrack(null)}
          setPhoto={setPhoto}
          track={editedTrack}
        />
      </Drawer>

      <Drawer
        title="Set playlist"
        drawerOpen={playlistLib.drawerOpen}
        onDrawerToggle={() => playlistLib.setDrawerOpen(false)}
      >
        <>
          <HorizCard
            title={playlistLib.currentTrack?.Title}
            src={playlistLib.currentTrack?.albumImage}
            caption={playlistLib.currentTrack?.artistName}
            subcaption={playlistLib.currentTrack?.albumName}
          />
          <div className="p-4">
            {/* {playlistLib.currentTrack?.Title} */}
            {playlistLib.listItems
              .sort((a, b) => a.Title.localeCompare(b.Title))
              .map((track) => (
                <div
                  key={track.ID}
                  onClick={() => playlistLib.updateList(track)}
                  className="flex justify-between mb-2 pb-1 border-b border-gray-300 cursor-pointer"
                >
                  <div className="font-semibold">{track.Title}</div>
                  <div>
                    {" "}
                    {playlistLib.matchList(track, playlistLib.currentTrack)
                      ? "❤️"
                      : "🖤"}
                  </div>
                </div>
              ))}

            <div
              onClick={() => playlistLib.createList()}
              className="flex justify-between mb-2 pb-1 border-b border-gray-300 cursor-pointer"
            >
              <div className="font-semibold">Create New Playlist</div>
              <div>➕</div>
            </div>
          </div>
        </>
      </Drawer>
    </>
  );
}
