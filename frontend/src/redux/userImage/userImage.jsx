// import {createSlice} from "@reduxjs/toolkit"

// export const imageUrl = createSlice({
//     name:'user_image_url',
//     initialState:{
//         // name:null,
//         profile_pic:null
//     },
//     reducers:{
//         set_user_image_url:(state,action)=>{
//             // state.name = action.payload.name
//             state.profile_pic = action.payload.profile_pic
//         }
//     }
// })
// export const {set_user_image_url} = imageUrl.actions

// export default imageUrl.reducer

import { createSlice } from "@reduxjs/toolkit";

export const imageUrl = createSlice({
  name: 'user_image_url',
  initialState: {
    profile_pic: null // Initial state of the profile picture
  },
  reducers: {
    set_user_image_url: (state, action) => {
      state.profile_pic = action.payload.profile_pic; // Updates the profile picture in the state
    }
  }
});

// Export the action
export const { set_user_image_url } = imageUrl.actions;

// Export the reducer as default
export default imageUrl.reducer;
