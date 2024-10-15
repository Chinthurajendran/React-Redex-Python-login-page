import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./authentication/authenticationSlice"; // Corrected import
import imageUrlReducer from "./userImage/userImage"
// Store configuration with the correct reducer
const store = configureStore({
  reducer: {
    authentication_user: authenticationReducer,
    user_image_url:imageUrlReducer
  },
});

export default store;
