
import { createSlice } from "@reduxjs/toolkit";

const birthdaySlice = createSlice({
  name: "birthday",
  initialState: {
    birthdaysShownToday: false,
  },
  reducers: {
    setBirthdayShownToday: (state, action) => {
      state.birthdaysShownToday = action.payload;
    },
  },
});

export const { setBirthdayShownToday } = birthdaySlice.actions;
export default birthdaySlice.reducer;

