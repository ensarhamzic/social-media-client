import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  token: null,
  isAuth: false,
  user: {
    id: null,
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    pictureURL: null,
    role: null,
  },
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token
      state.isAuth = true
      const { id, firstName, lastName, username, email, pictureURL, role } =
        action.payload.user
      state.user = {
        id,
        firstName,
        lastName,
        username,
        email,
        pictureURL,
        role,
      }
      localStorage.setItem("token", action.payload.token)
    },
    logout: (state, action) => {
      state.token = initialState.token
      state.isAuth = initialState.isAuth
      state.user = { ...initialState.user }
      localStorage.removeItem("token")
    },
  },
})

export const authActions = authSlice.actions
export default authSlice.reducer
