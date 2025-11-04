// components/AudioPlayer/AudioPlayer.jsx
import { useState, useRef, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { announceChange } from "../../announcer";
import Logo from "../Logo/Logo";
import "./AudioPlayer.css";
import HorizCard from "../HorizCard/HorizCard";
import { useSelector } from "react-redux";

export const CLOUD_FRONT_URL = "https://s3.amazonaws.com/box.import/";
function playerUrl(FileKey) {
  const audioURL = `${CLOUD_FRONT_URL}${FileKey}`
    .replace("#", "%23")
    .replace(/\+/g, "%2B");
  return audioURL;
}

export default function AudioPlayer({
  // currentSongId,
  // currentSongList,
  // currentSong,
  onSongSelect,
  onSongEnd,
  onSongPrev,
  announcerEnabled,
  chatType,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const storage = useSelector((state) => state.songs);

  const currentSongId = storage.currentSongId;
  const currentSong = storage.currentSong;
  const currentSongList = storage.songList;
  console.log(
    "AudioPlayer render - currentTime:",
    currentTime,
    "duration:",
    duration
  ); // Add this at the top of your component function

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // --- START OF CHANGE 1: Modified updatePositionState ---
  // Function to update media session position state
  const updatePositionState = () => {
    if (
      "mediaSession" in navigator &&
      navigator.mediaSession.setPositionState &&
      audioRef.current
    ) {
      const audio = audioRef.current;
      // Only update if duration is a valid, positive number
      if (!isFinite(audio.duration) || audio.duration <= 0) {
        return;
      }
      try {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate || 1,
          // Use Math.max/min for safety
          position: Math.min(Math.max(0, audio.currentTime), audio.duration),
        });
      } catch (error) {
        console.warn("Media Session position state update failed:", error);
      }
    }
  };
  // --- END OF CHANGE 1 ---

  // Media Session API setup
  useEffect(() => {
    if (!("mediaSession" in navigator) || !currentSong) return;

    // Set media metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.Title || "Unknown Title",
      artist: currentSong.artistName || "Unknown Artist",
      album: currentSong.albumName || "Unknown Album",
      artwork: currentSong.albumImage
        ? [
            {
              src: currentSong.albumImage,
              sizes: "512x512",
              type: "image/jpeg",
            },
          ]
        : [],
    });

    // Media action handlers
    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
      setIsPlaying(true);
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });

    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      const skipTime = details.seekOffset || 10;
      if (audioRef.current) {
        audioRef.current.currentTime = Math.max(
          audioRef.current.currentTime - skipTime,
          0
        );
        updatePositionState();
      }
    });

    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      const skipTime = details.seekOffset || 10;
      if (audioRef.current) {
        audioRef.current.currentTime = Math.min(
          audioRef.current.currentTime + skipTime,
          audioRef.current.duration
        );
        updatePositionState();
      }
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (audioRef.current && details.seekTime !== undefined) {
        audioRef.current.currentTime = details.seekTime;
        setCurrentTime(details.seekTime);
        updatePositionState();
      }
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      // Implement previous track logic if available
      console.log("Previous track requested");
      onSongPrev?.();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      onSongEnd?.();
    });

    // Initialize position state
    updatePositionState();

    // Cleanup media session
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
        // Remove all action handlers
        [
          "play",
          "pause",
          "seekbackward",
          "seekforward",
          "seekto",
          "previoustrack",
          "nexttrack",
        ].forEach((action) => {
          navigator.mediaSession.setActionHandler(action, null);
        });
      }
    };
  }, [currentSong, onSongEnd]);

  // --- CORRECT CHANGE 2 ---
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);
  // --- END CORRECT CHANGE 2 ---

  // --- FIXED CHANGE 3: Proper timeupdate handling ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return console.log("No media player");

    const updateTime = () => {
      console.log("timeupdate - currentTime:", audio.currentTime); // Debug log
      setCurrentTime(audio.currentTime);
      updatePositionState();
    };

    const updateDuration = () => {
      console.log("loadedmetadata - duration:", audio.duration); // Debug log
      setDuration(audio.duration);
      updatePositionState();
    };

    const handleEnd = () => {
      setIsPlaying(false);
      onSongEnd?.();
    };

    const handleLoadedData = () => {
      updatePositionState();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnd);
    audio.addEventListener("loadeddata", handleLoadedData);

    console.log("Event listeners attached!");
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnd);
      audio.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);
  // --- END FIX ---

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
            currentSong.trackTime,
            chatType,
            () => {
              audio.volume = 0.5;
            },
            () => {
              audio.volume = 1;
            }
          );
        }
        await audio.play();
        setIsPlaying(true);
        updatePositionState(); // Update position state after play starts
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
    if (!audio) return alert("Could not find audio element");

    const newTime = parseFloat(e.target.value);
    console.log({ newTime });
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    updatePositionState(); // Update position state after seeking
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // if (!currentSongId) {
  //   return (
  //     <div className="audio-player disabled">
  //       <div className="text-center p-4 text-gray-500">
  //         Select a song to play
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Drawer
        title="Playlist"
        drawerOpen={drawerOpen}
        onDrawerToggle={handleDrawerToggle}
      >
        <ul className="list-none p-0 border border-gray-300 rounded-lg max-w-sm mx-auto shadow-md">
          {currentSongList.map((song) => (
            <li
              onClick={() => onSongSelect(song, currentSongList)}
              key={song.ID}
              style={{
                fontStyle: song.queued ? "italic" : "none",
                color: song.queued ? "gray" : "black",
              }}
              className={`${
                song.FileKey === currentSongId ? "bg-yellow-300 " : ""
              } p-1 bg-white text-gray-800 hover:bg-gray-100 cursor-pointer border-b-gray-800 flex`}
            >
              <Logo
                className={
                  song.FileKey === currentSongId ? "playing-animation" : ""
                }
                src={song.albumImage}
                alt={song.Title}
                style={{
                  w: 24,
                  height: 24,
                  borderRadius: "50%",
                }}
              />{" "}
              {song.Title}
            </li>
          ))}
        </ul>
      </Drawer>

      <div
        className={`audio-player  bg-white border-t border-gray-200 p-4 shadow-lg ${
          !!currentSongId ? "playing" : ""
        }`}
      >
        <div>
          <audio ref={audioRef} preload="metadata" />
        </div>

        <div className="audio-outer">
          <div className="audio-label">
            <HorizCard
              title={currentSong?.Title}
              src={currentSong?.albumImage}
              caption={currentSong?.artistName}
              subcaption={currentSong?.albumName}
            />
          </div>
          <div className="audio-controls">
            <div className="audio-buttons">
              <div className="link" onClick={onSongPrev}>
                ⏮
              </div>
              <button
                onClick={togglePlayPause}
                className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>

              <div onClick={onSongEnd} className="link">
                ⏭
              </div>
            </div>

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
                className="flex-1 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          <div className="panel-controls">
            <button onClick={handleDrawerToggle} className="p-2 rounded-full">
              🎵
            </button>
            <button
              onClick={() => {
                togglePlayPause();
                onSongSelect(null, []);
              }}
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
