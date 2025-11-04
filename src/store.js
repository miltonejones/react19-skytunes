import { configureStore } from "@reduxjs/toolkit";
import trackReducer from "./trackSlice";

export const store = configureStore({
  reducer: {
    songs: trackReducer,
  },
});
