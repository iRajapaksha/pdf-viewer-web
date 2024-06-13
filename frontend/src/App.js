import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import Register from "./components/RegisterPage";
import './App.css'

function App() {
  const [auth, setAuth] = useState({ token: null, isAuthenticated: false });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuth({ token, isAuthenticated: true });
    }
  }, []);

  return (
    <div className="App">
       <Router>
         <Routes>
          <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
           <Route path="/register" element={<Register setAuth={setAuth} />} />
          <Route path="/home" element={<HomePage auth={auth} />} />
        </Routes>
       </Router>
    </div>

  );
}

export default App;
