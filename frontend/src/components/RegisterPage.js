import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Register({setAuth}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
        const { token } = response.data;
        localStorage.setItem('authToken', token);
        setAuth({ token, isAuthenticated: true });
        navigate('/home');
    } catch (error) {
        console.error('Login failed', error);
    }
};
  return (
    <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
        <div>
                <label>Username</label>
                <input
                    type="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
);
}
