import { createSlice } from "@reduxjs/toolkit";

// Define namespace
const name = "layout";

// Actual Slice
export const layoutSlice = createSlice({
  name,
  initialState: {
    openMenuState: false,
  },
  reducers: {
    setOpenMenuState(state, action) {
      state.openMenuState = action.payload;
    },
  },
});

export const { setOpenMenuState } = layoutSlice.actions;

export const openMenuState = (state) => state[name].openMenuState;

export default layoutSlice.reducer;