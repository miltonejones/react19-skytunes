import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dash from "./components/Dash/Dash";
import Library from "./components/Library/Library";
import NavBar from "./components/Navbar/Navbar";
import { useCallback, useState } from "react";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import ArtistDetail from "./components/ArtistDetail/ArtistDetail";
import AlbumDetail from "./components/AlbumDetail/AlbumDetail";
import GenreDetail from "./components/GenreDetail/GenreDetail";
import AlbumGrid from "./components/AlbumGrid/AlbumGrid";
import ArtistGrid from "./components/ArtistGrid/ArtistGrid";
import GenreGrid from "./components/GenreGrid/GenreGrid";
import PlaylistGrid from "./components/PlaylistGrid/PlaylistGrid";
import PlaylistDetail from "./components/PlaylistDetail/PlaylistDetail";
import SearchResults from "./components/SearchResults/SearchResults";
import { useDispatch, useSelector } from "react-redux";
import {
  addToQueue,
  advanceTrack,
  setAnnouncerEnabledValue,
  setChatTypeValue,
  setSongList,
} from "./trackSlice";

function AppContent() {
  const dispatch = useDispatch();
  const { currentSongId, currentSong, chatType, announcerEnabled } =
    useSelector((state) => state.songs);

  const handleSongSelect = (song, songs) => {
    dispatch(
      setSongList({
        songs,
        song,
      })
    );
  };

  const setAnnouncerEnabled = (value) =>
    dispatch(setAnnouncerEnabledValue(value));

  const setChatType = (value) => dispatch(setChatTypeValue(value));

  const insertTrackAfterCurrent = useCallback((track) => {
    dispatch(addToQueue(track));
  }, []);

  const handleSongEnd = useCallback(() => {
    dispatch(advanceTrack(1));
  }, []);

  const handleSongPrev = useCallback(() => {
    dispatch(advanceTrack(-1));
  }, []);

  return (
    <>
      <NavBar />
      <div className={`workspace ${currentSong ? "playing" : ""}`}>
        <Routes>
          {/* Route for the Dash component: path="/" */}
          <Route path="/" element={<Dash />} />

          <Route path="/artist/grid" element={<ArtistGrid />} />
          <Route path="/artist/grid/:page" element={<ArtistGrid />} />
          <Route path="/artist" element={<ArtistGrid />} />

          <Route path="/album/grid/:page" element={<AlbumGrid />} />
          <Route path="/album" element={<AlbumGrid />} />

          <Route path="/genre/grid/:page" element={<GenreGrid />} />
          <Route path="/genre" element={<GenreGrid />} />

          <Route path="/playlist/grid" element={<PlaylistGrid />} />
          <Route path="/playlist/grid/:page" element={<PlaylistGrid />} />
          <Route path="/playlist" element={<PlaylistGrid />} />

          <Route
            path="/library"
            element={
              <Library
                onSongSelect={handleSongSelect}
                onSongInsert={insertTrackAfterCurrent}
                currentSongId={currentSongId}
              />
            }
          />
          <Route
            path="/library/:page"
            element={
              <Library
                onSongSelect={handleSongSelect}
                onSongInsert={insertTrackAfterCurrent}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/search/:param"
            element={
              <SearchResults
                onSongSelect={handleSongSelect}
                onSongInsert={insertTrackAfterCurrent}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/album/detail/:id"
            element={
              <AlbumDetail
                onSongSelect={handleSongSelect}
                onSongInsert={insertTrackAfterCurrent}
                currentSongId={currentSongId}
              />
            }
          />
          <Route
            path="/playlist/detail/:id"
            element={
              <PlaylistDetail
                onSongSelect={handleSongSelect}
                onSongInsert={insertTrackAfterCurrent}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/artist/detail/:id"
            element={
              <ArtistDetail
                onSongSelect={handleSongSelect}
                onSongInsert={insertTrackAfterCurrent}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/genre/detail/:id"
            element={
              <GenreDetail
                onSongSelect={handleSongSelect}
                onSongInsert={insertTrackAfterCurrent}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/genre/detail/:id/:page"
            element={
              <GenreDetail
                onSongSelect={handleSongSelect}
                onSongInsert={insertTrackAfterCurrent}
                currentSongId={currentSongId}
              />
            }
          />

          {/* Optional: Catch-all route for 404/not found */}
          <Route
            path="*"
            element={
              <div className="p-8 text-center text-2xl text-red-600">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
        <div className="p-2">
          <input
            type="checkbox"
            id="announcerToggle"
            checked={announcerEnabled}
            onChange={(e) => setAnnouncerEnabled(e.target.checked)}
          />
          <label for="announcerToggle" className="ml-2">
            AI announcer enabled
          </label>

          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 ml-2">
            <button
              onClick={() => setChatType("announce")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                chatType === "announce"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ChatGPT
            </button>
            <button
              onClick={() => setChatType("deep")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                chatType === "deep"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Deepseek
            </button>
            <button
              onClick={() => setChatType("claude")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                chatType === "claude"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Claude
            </button>
          </div>
        </div>
      </div>
      <AudioPlayer
        announcerEnabled={announcerEnabled}
        chatType={chatType}
        onSongSelect={handleSongSelect}
        onSongEnd={handleSongEnd}
        onSongPrev={handleSongPrev}
      />
    </>
  );
}

// The main App component wraps everything in BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
