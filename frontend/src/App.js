import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Container/User/Home/Homepage";
import Loginpage from "./Container/User/Login/Loginpage";
import Signuppage from "./Container/User/Signup/Signuppage";
import Profilepage from "./Container/User/Profile/Profilepage";
import Adminlogin from "./Container/Admin/Login/Adminlogin"
import Adminedit from "./Container/Admin/Edit/Adminedit";
import Adminhomepage from "./Container/Admin/Home/Adminhomepage";
import AdminCreate from "./Container/Admin/Create/AdminCreate";
import store from "./redux/store";
import { Provider } from "react-redux";
import {ToastContainer,toast} from "react-toastify"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/signup" element={<Signuppage />} />
            <Route path="/profile" element={<Profilepage />} />

            <Route path="/adminlogin" element={<Adminlogin />} />
            <Route path="/adminedit/:id" element={<Adminedit />} />
            <Route path="/adminhome" element={<Adminhomepage />} />
            <Route path="/admincreate" element={<AdminCreate />} />
          </Routes>
          <ToastContainer/>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
