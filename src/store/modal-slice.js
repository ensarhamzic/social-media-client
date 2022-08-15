import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  title: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    show: (state, action) => {
      state.show = true;
      state.title = action.payload.title;
    },
    hide: (state, action) => {
      state.show = initialState.show;
      state.title = initialState.title;
    },
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;
