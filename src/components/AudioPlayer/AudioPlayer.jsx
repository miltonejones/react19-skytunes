// components/AudioPlayer/AudioPlayer.jsx
import { useState, useRef, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { announceChange } from "../../announcer";

export const CLOUD_FRONT_URL = "https://s3.amazonaws.com/box.import/";
function playerUrl(FileKey) {
  const audioURL = `${CLOUD_FRONT_URL}${FileKey}`
    .replace("#", "%23")
    .replace(/\+/g, "%2B");
  return audioURL;
}

export default function AudioPlayer({
  currentSongId,
  currentSongList,
  currentSong,
  onSongSelect,
  onSongEnd,
  announcerEnabled,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      onSongEnd?.();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [onSongEnd]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSongId) return;

    // Load new song when currentSongId changes
    audio.src = playerUrl(currentSongId);
    audio.load();

    // Auto-play when a new song is selected
    const playAudio = async () => {
      try {
        if (announcerEnabled) {
          await announceChange(
            currentSong.artistName,
            currentSong.Title,
            () => {
              audio.volume = 0.75;
            },
            () => {
              audio.volume = 1;
            }
          );
        }
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Auto-play failed:", error);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [currentSongId]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentSongId) {
    return (
      <div className="audio-player disabled">
        <div className="text-center p-4 text-gray-500">
          Select a song to play
        </div>
      </div>
    );
  }

  return (
    <>
      <Drawer
        title="Playlist"
        drawerOpen={drawerOpen}
        onDrawerToggle={handleDrawerToggle}
      >
        <ul class="list-none p-0 border border-gray-300 rounded-lg max-w-sm mx-auto shadow-md">
          {currentSongList.map((song) => (
            <li
              onClick={() => onSongSelect(song, currentSongList)}
              key={song.ID}
              className={`${
                song.FileKey === currentSongId ? "bg-yellow-300" : ""
              } p-1 bg-white text-gray-800 hover:bg-gray-100 cursor-pointer first:rounded-t-lg last:border-b-0 last:rounded-b-lg`}
            >
              {song.Title}
            </li>
          ))}
        </ul>
      </Drawer>
      <div className="audio-player fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div>
          <audio ref={audioRef} preload="metadata" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-600">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-2  rounded-lg  cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="ml-4">
              <span className="truncate text-sm font-medium text-gray-700">
                {currentSong?.Title}
              </span>
            </div>

            <button onClick={handleDrawerToggle} className="p-2 rounded-full">
              🎵
            </button>
            <button
              onClick={() => onSongSelect(null, [])}
              className="p-2 rounded-full"
            >
              ❌
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
