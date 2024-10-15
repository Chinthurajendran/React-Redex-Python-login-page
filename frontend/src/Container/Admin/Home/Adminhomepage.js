    import React, { useState,useEffect } from 'react';
    import './Adminhomepage.css'
    import { baseURL } from '../../../baseUrls/baseUrl';
    import axios from "axios";
    import { useNavigate } from 'react-router-dom';



    function Adminhomepage() {

    const token = localStorage.getItem("access");
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate()
    console.log(token)

    useEffect(()=>{
        const email = localStorage.getItem('email')
        if(email){
            navigate('/adminhome')
        }

    },[navigate])

    const fetchUsers  = (url)=>{
        axios.get(url,{
            headers: { 'authorization': `Bearer ${token}` }
        })
        .then((res)=>{
            setUsers(res.data)
        })
        .catch((error)=>{
            console.error("Error fetching users:", error);
        })

    }

    useEffect(()=>{
        fetchUsers(`${baseURL}/userlist`);
    },[])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteUser = async(id) => {
        try{
            await axios.delete(`${baseURL}userdelete/${id}/`,{
                headers: { 'authorization': `Bearer ${token}` }
            })
            setUsers(users.filter(user => user.id !== id));
        }
        catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleCreateUser = ()=>{
        navigate("/admincreate")
    }
    
    const handleEditeUser = (id)=>{
        navigate(`/adminedit/${id}`)
    }

    const logoutButton = ()=>{
        localStorage.clear()
        navigate("/adminlogin")

    }

    return (
        <div className="admin-homepage-container">
        <header className="admin-header">
            <button className="logo-button" onClick={logoutButton}>
            Logout
            </button>
            <h1>Admin Dashboard</h1>
        </header>
        <div className="search-container">
            <input 
            type="text" 
            placeholder="Search User" 
            value={searchTerm} 
            onChange={handleSearch} 
            className="search-input"
            />
        </div>
        <table className="user-table">
            <thead>
            <tr>
                <th>Name</th>
                <th style={{ paddingRight: '10px' }} >Email</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredUsers.map(user => (
                <tr key={user.id}>
                <td>{`${user.first_name} ${user.last_name}`}</td>
                <td>{user.email}</td>
                <td>
                    <button className="add-button" onClick={handleCreateUser}>Create User</button>
                    <button className="edit-button" onClick={() =>handleEditeUser(user.id)} >Edit</button>
                    <button 
                    className="delete-button" 
                    onClick={() => handleDeleteUser(user.id)}
                    >
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    }

    export default Adminhomepage;
