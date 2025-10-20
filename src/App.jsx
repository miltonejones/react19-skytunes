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

function AppContent() {
  const [currentSongId, setCurrentSongId] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [announcerEnabled, setAnnouncerEnabled] = useState(true);
  const [currentSongList, setCurrentSongList] = useState([]);

  const handleSongSelect = (song, songs) => {
    setCurrentSongId(song?.FileKey);
    setCurrentSong(song);
    setCurrentSongList(songs);
  };

  const handleSongEnd = useCallback(() => {
    const keys = currentSongList.map((song) => song.FileKey);
    const index = keys.indexOf(currentSongId);
    const nextIndex = index + 1;
    handleSongSelect(currentSongList[nextIndex], currentSongList);
  }, [currentSongList, currentSong]);

  return (
    <>
      <NavBar />
      <div className={`workspace ${currentSong ? "playing" : ""}`}>
        <Routes>
          {/* Route for the Dash component: path="/" */}
          <Route path="/" element={<Dash />} />

          {/* Routes for the Library component: path="/library" and path="/library/:page" */}
          <Route
            path="/library"
            element={
              <Library
                onSongSelect={handleSongSelect}
                currentSongId={currentSongId}
              />
            }
          />
          <Route
            path="/library/:page"
            element={
              <Library
                onSongSelect={handleSongSelect}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/search/:param"
            element={
              <SearchResults
                onSongSelect={handleSongSelect}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/album/detail/:id"
            element={
              <AlbumDetail
                onSongSelect={handleSongSelect}
                currentSongId={currentSongId}
              />
            }
          />

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
            path="/playlist/detail/:id"
            element={
              <PlaylistDetail
                onSongSelect={handleSongSelect}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/artist/detail/:id"
            element={
              <ArtistDetail
                onSongSelect={handleSongSelect}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/genre/detail/:id"
            element={
              <GenreDetail
                onSongSelect={handleSongSelect}
                currentSongId={currentSongId}
              />
            }
          />

          <Route
            path="/genre/detail/:id/:page"
            element={
              <GenreDetail
                onSongSelect={handleSongSelect}
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
        </div>
      </div>
      <AudioPlayer
        announcerEnabled={announcerEnabled}
        currentSong={currentSong}
        currentSongId={currentSongId}
        currentSongList={currentSongList}
        onSongSelect={handleSongSelect}
        onSongEnd={handleSongEnd}
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
