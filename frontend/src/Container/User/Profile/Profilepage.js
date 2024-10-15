import React, { useState,useEffect } from 'react';
import './Profilepage.css'; // Import the CSS file
import { connect, useSelector ,useDispatch } from "react-redux";
import { baseURL } from "../../../baseUrls/baseUrl";
import { set_user_image_url } from '../../../redux/userImage/userImage';
import axios from "axios";


function Profilepage() {
  const authentication_user = useSelector(state => state.authentication_user)
  const image = useSelector(state => state.user_image_url);

  const [profilePic, setProfilePic] = useState({image:null});
  const [uploadedImageURL, setUploadedImageURL] = useState('')
  const [userdata, setuserdata]= useState([])
  const dispatch = useDispatch();

  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name")


  useEffect(()=>{
    const image = localStorage.getItem("profile_pic")

    if(image){
      dispatch(set_user_image_url({
        profile_pic:image
      }));
    }
  },[dispatch])
  
  const handleFileChange = (event) => {
    setProfilePic({image: event.target.files[0]});
  };


  useEffect(()=>{
    const token = localStorage.getItem("access");
    axios.post('http://localhost:8000/imageurl',{
      email:authentication_user.email
    },{
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the headers
      }
    }).then(response=>{
      setuserdata(response.data)
    })
    .catch(error => {
      console.log(error);
    });

  },[profilePic])

    const handleUpload = (e) => {
    e.preventDefault();

    let form_data = new FormData();
    form_data.append('profile_pic',profilePic.image, profilePic.image.name);
    // form_data.append('email', authentication_user.email)
    const token = localStorage.getItem("access");
    let url = baseURL+'/uploadimage';
    axios.post(url,form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'authorization': `Bearer ${token}`,
      }
    })
        .then(res => {
          setUploadedImageURL(res.data)
          console.log(res.data)
          localStorage.setItem("profile_pic",res.data.profile_pic)
          dispatch(set_user_image_url({
            profile_pic:res.data.profile_pic
          }))

        })
        .catch(err => console.log(err))
  }
console.log('chitnhu')
console.log(image)
  return (
    <div className="profilepage-container">
      <div className="profilepage-content">
        <h1>User Profile</h1>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          id="profile-pic-input"
        />
        <label htmlFor="profile-pic-input">
          <img
            src={image?.profile_pic
              ? `http://localhost:8000${image.profile_pic}`
              : "https://via.placeholder.com/120"}
            alt="Profile"
            className="profile-picture"
          />
        </label>  
        <div className="profile-info">
          <label>Name:</label>
          <span>{name ? name : 'Loading...'}</span>
          <label>Email:</label>
          <span>{email ? email : 'Loading...'}</span>
        </div>
        <button className="upload-button" onClick={handleUpload} >Upload Profile Picture</button>
      </div>
    </div>
  );
}

export default Profilepage;
