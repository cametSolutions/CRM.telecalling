import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("authToken") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  activeCompany:
    JSON.parse(localStorage.getItem("activeCompany")) || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user,activeCompany } = action.payload;

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
state.activeCompany = activeCompany;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
 localStorage.setItem(
        "activeCompany",
        JSON.stringify(activeCompany)
      );
    },
 changeActiveCompany: (state, action) => {

      state.activeCompany = action.payload;

      localStorage.setItem(
        "activeCompany",
        JSON.stringify(action.payload)
      );
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },

    updateUser: (state, action) => {
      state.user = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const {
  loginSuccess,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;