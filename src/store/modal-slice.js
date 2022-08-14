import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  title: null,
  element: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    show: (state, action) => {
      state.show = true;
      state.title = action.payload.title;
      state.element = action.payload.element;
    },
    hide: (state, action) => {
      state.show = initialState.show;
      state.title = initialState.title;
      state.element = initialState.element;
    },
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;
