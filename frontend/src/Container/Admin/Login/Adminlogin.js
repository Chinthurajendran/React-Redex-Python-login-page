import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Adminlogin.css'
import { set_Authentication } from "../../../redux/authentication/authenticationSlice";
import { baseURL } from "../../../baseUrls/baseUrl";
import Swal from "sweetalert2";

function Adminlogin() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData,setFormData] = useState({email: "",password: "",})


  const handleChange = (e)=>{
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }


  const handleLoginSubmit = async(event)=>{
    event.preventDefault()

    const payload = {
        email: formData.email,
        password: formData.password,
    };

    try{
        const res = await axios.post(`${baseURL}/login`, payload)
        if (res.status === 200){
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
          localStorage.setItem("email", formData.email);

          dispatch(
            set_Authentication({
              name:(res.data.access).first_name,
              email: formData.email,
              isAuthenticated: true,
              isAdmin:res.data.isAdmin
            })
          )
          navigate('/adminhome')
        }
      }catch(error){
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: error.response.data.message || "Invalid credentials",
          });
        }
          else
          {
            console.log(error.response.data);
      
          }
      }


  }

  return (
    <div className="adminlogin-container">
      <div className="adminlogin-content">
        <h1>Admin Login</h1>
        <form onSubmit={handleLoginSubmit} method="post" >
          <input type="email" className="login-input" placeholder="Email" name="email" value={formData.email} onChange={handleChange}  required />
          <input type="password" className="login-input" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
          <button className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Adminlogin;
