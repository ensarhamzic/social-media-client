import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import modalReducer from "./modal-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
  },
});

export default store;
