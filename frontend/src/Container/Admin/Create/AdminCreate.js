import React, { useState } from "react"; // Import useState
import "./AdminCreate.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../baseUrls/baseUrl"; // Adjust baseURL if necessary
import Swal from "sweetalert2";

function AdminCreate() {
  const [formError, setFormError] = useState([]); // State for form errors
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateUserSubmit = async (event) => {
    event.preventDefault();
    setFormError([]);

    if (formData.password !== formData.confirm_password) {
      return setFormError(["Password and Confirm Password must be the same"]);
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await axios.post(`${baseURL}/register`, payload);
      if (res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User created successfully!',
        });
        navigate("/adminhome"); // Redirect to the user list or admin dashboard
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || "An unexpected error occurred. Please try again.";
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="admin-create-container">
      <div className="admin-create-content">
        <h1>Create User</h1>
        <p>Fill in the details below to create a new user</p>
        <form onSubmit={handleCreateUserSubmit} method="POST">
          <input
            type="text"
            className="signup-input"
            placeholder="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            className="signup-input"
            placeholder="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="signup-input"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="signup-input"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="signup-input"
            placeholder="Confirm Password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          {formError.length > 0 && <p style={{ color: "red" }}>{formError}</p>}
          <button type="submit" className="signup-button">
            Create User
          </button>
        </form>
        <a href="/admin/users" onClick={() => navigate("/adminhome")}>
          Back to User List
        </a>
      </div>
    </div>
  );
}

export default AdminCreate;
