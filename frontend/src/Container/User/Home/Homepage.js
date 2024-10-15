import React,{useEffect} from 'react';
import './Homepage.css'; // Link the CSS file
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import { set_Authentication } from '../../../redux/authentication/authenticationSlice';
import { Link } from 'react-router-dom'
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { set_user_image_url } from '../../../redux/userImage/userImage';

function Homepage() {
  const authentication_user = useSelector(state => state.authentication_user)
  const image = useSelector(state => state.user_image_url);
  const userName = authentication_user.name; 
  const profilePic = "https://via.placeholder.com/120";
  const profilePicPlaceholder = "https://via.placeholder.com/120";
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  
  const token = localStorage.getItem("access");
  console.log(token)

  useEffect(()=>{
    const token = localStorage.getItem("access");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name")
    const image = localStorage.getItem("profile_pic")

    if(token && email && name){
      dispatch(set_Authentication({
        name: name,
        email: email,
        isAuthenticated: true,
      }));
      dispatch(set_user_image_url({
        profile_pic:image
      }));
    }
  },[dispatch])

  useEffect(()=>{
    const email = localStorage.getItem("email")
    if (email){
      navigate('/')
    }
  },[navigate])

  useEffect(() => {
    if (location.state && location.state.message) {
      toast.success(location.state.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [location]);


  const handleLogoutSubmit = ()=>{
    localStorage.clear()
    dispatch(
      set_Authentication({
        name:null,
        email:null,
        isAuthenticated:false,
        isAdmin:false
      })
    )
    navigate("/login")
  }

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        {userName && (
          <Link to="/profile">
          <img 
            src={image?.profile_pic 
              ? `http://localhost:8000${image.profile_pic}` 
              : profilePicPlaceholder} 
            alt="Profile" 
            className="profile-picture" 
          />
        </Link>
        )}
        <h1>Welcome,{userName}!</h1>
        <p>Please login to continue</p>
        {userName ? (<button className="login-button" onClick={handleLogoutSubmit}>Logout</button>):
        (<button className="login-button" onClick={() => navigate('/login')}>Login</button>)}
      </div>
    </div>
  );
}

export default Homepage;
