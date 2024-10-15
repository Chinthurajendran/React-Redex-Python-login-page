import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Adminedit.css'; // Link to CSS file
import axios from "axios";
import { baseURL } from '../../../baseUrls/baseUrl';

function Adminedit() {
    const token = localStorage.getItem("access");
    const [formError, setFormError] = useState([]);
    const { id } = useParams();
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseURL}fetchdata/${id}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Ensure all user fields are present and reset password fields
                setUser({
                    first_name: response.data.first_name || '',
                    last_name: response.data.last_name || '',
                    email: response.data.email || ''
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                setFormError(["Failed to fetch user data."]);
            }
        };

        fetchUserData();
    }, [id, token]); // Dependency array

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError([]); // Reset form errors

        // Prepare the payload for the API request
        const payload = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        try {
            // Send a PUT request to update the user
            const res = await axios.put(`${baseURL}updatedata/${id}/`, payload, {
                headers: { 'Authorization': `Bearer ${token}` } // Include the token for authorization
            });

            console.log('User updated successfully:', res.data);
            // Navigate to the home page after successful update
            navigate('/adminhome'); // Change '/' to the path of your home page

        } catch (error) {
            console.error('Error updating user data:', error);
            if (error.response) {
                setFormError([error.response.data.detail || "An error occurred."]);
            } else {
                setFormError(["Network error, please try again later."]);
            }
        }
    };

    return (
        <div className="adminedit-container">
            <div className="adminedit-content">
                <h1>Edit User Details</h1>
                {formError.length > 0 && (
                    <div className="error-messages">
                        {formError.map((error, index) => (
                            <p key={index} className="error">{error}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="edit-user-form">
                    <div className="input-group">
                        <label htmlFor="first_name">First Name:</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={user.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="last_name">Last Name:</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={user.last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="save-button">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default Adminedit;
