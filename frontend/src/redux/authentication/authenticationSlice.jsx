import { createSlice } from "@reduxjs/toolkit";

export const authenticationSlice = createSlice({
  name: "authentication_user",
  initialState: {
    name: null,
    email: null,
    isAuthenticated: false,
  },
  reducers: {
    set_Authentication: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
});

// Corrected 'actions' typo
export const { set_Authentication } = authenticationSlice.actions;

export default authenticationSlice.reducer;
