import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songList: [],
  currentSong: null,
  currentSongId: null,
  announcerEnabled: true,
  chatType: "deep",
};

const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    setSongList: (state, action) => {
      state.songList = action.payload.songs;
      state.currentSong = action.payload.song;
      state.currentSongId = action.payload.song?.FileKey;
    },
    advanceTrack: (state, action) => {
      const keys = state.songList.map((song) => song.FileKey);
      const index = keys.indexOf(state.currentSongId);
      const nextIndex = index + action.payload;
      const song = state.songList[nextIndex];
      state.currentSong = song;
      state.currentSongId = song?.FileKey;
    },
    setChatTypeValue: (state, action) => {
      state.chatType = action.payload;
    },
    setAnnouncerEnabledValue: (state, action) => {
      state.announcerEnabled = action.payload;
    },
    addToQueue: (state, action) => {
      const keys = state.songList.map((song) => song.FileKey);
      const index = keys.indexOf(state.currentSongId);

      // Add queued property to the track
      const queuedTrack = {
        ...action.payload,
        queued: true,
      };

      const newSongList = [...state.songList];

      let insertIndex = index + 1;

      // Look for the last track with queued property
      for (let i = state.songList.length - 1; i > index; i--) {
        if (state.songList[i].queued) {
          insertIndex = i + 1;
          break;
        }
      }

      console.log({ queuedTrack, newSongList });

      // Insert the new queued track at the found position
      newSongList.splice(insertIndex, 0, queuedTrack);
      state.songList = newSongList;
    },
  },
});

export const {
  setSongList,
  advanceTrack,
  addToQueue,
  setAnnouncerEnabledValue,
  setChatTypeValue,
} = songSlice.actions;
export default songSlice.reducer;
