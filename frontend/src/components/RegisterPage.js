import { Box, Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/login.jpg';

const RegisterPage = ({setAuth}) => {

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
    <Container component="main" maxWidth="md" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
            <Paper elevation={2}>
            <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src= {loginImage} 
                        alt="LoginImage"
                        style={{ width: '100%', height: 'auto', maxHeight: '100%' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' ,padding: '8px'}}>
                        <Typography component="h1" variant="h5">
                            PDF Viewer Signup
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 3 }}>
                        <TextField
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                margin="normal"
                            />
                            <TextField
                                onChange={(e)=>setUsername(e.target.value)}
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                margin="normal"
                            />
                            <TextField
                                onChange={(e)=> setPassword(e.target.value)}
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                margin="normal"
                            />
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Signup
                            </Button>
                            <>Already have an account?{" "}
                            <Link href="/login" variant="body2">
                                 Login Now
                            </Link>
                            </>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            </Paper>
        </Container>
);
};

export default RegisterPage;