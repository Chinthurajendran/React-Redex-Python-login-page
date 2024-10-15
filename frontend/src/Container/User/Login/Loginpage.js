import React, { useEffect,useState } from "react";
import "./Loginpage.css"; // Import the CSS file
import { useNavigate, useLocation} from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { baseURL } from "../../../baseUrls/baseUrl";
import { set_Authentication } from "../../../redux/authentication/authenticationSlice";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";


function Loginpage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  useEffect(() => {
    if (location.state && location.state.message) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: location.state.message,
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (event)=>{
    event.preventDefault();

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
        localStorage.setItem("name",jwtDecode(res.data.access).first_name)


        dispatch(
          set_Authentication({
            name:jwtDecode(res.data.access).first_name,
            email: formData.email,
            isAuthenticated: true,
            isAdmin:res.data.isAdmin
          })
        )
        navigate('/')
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
    <div className="loginpage-container">
      <div className="loginpage-content">
        <h1>Login</h1>
        <p>Welcome back! Please login to your account</p>
        <form onSubmit={handleLoginSubmit} method="post" >
          <input type="email" className="login-input" placeholder="Email" name="email" value={formData.email} onChange={handleChange}  required />
          <input type="password" className="login-input" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
          <button className="login-button">Login</button>
          <p className="or-text">Or</p>{" "}
          {/* A simple "or" text to separate the buttons */}
          <button className="register-button" onClick={() => navigate("/signup")}>
            Register
          </button>{" "}
        </form>
      </div>
    </div>
  );
}

export default Loginpage;
