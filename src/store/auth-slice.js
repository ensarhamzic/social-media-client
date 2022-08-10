import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuth = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state, action) => {
      state.token = null;
      state.isAuth = false;
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
