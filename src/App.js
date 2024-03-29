import React from 'react'; // Import React

import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import SignInScreen from './screens/auth/SignIn/SignInScreens';

const tokenIsValid = (token) => {
  // Implement your token validation logic here
  try {
    const decoded = jwtDecode(token);
    const expiration = decoded.exp; // assuming your token has an expiration time

    // Check if the token has expired
    return expiration > Math.floor(Date.now() / 1000);
  } catch (error) {
    return false; // Token is invalid
  }
};



const isAuthenticated = (requiredRole) => {
  const token = localStorage.getItem('accessToken'); // Change this to your actual storage method
  const userRole = localStorage.getItem('role'); // Change this to your actual storage method

  if (!tokenIsValid(token)) {
    return false; // Token is invalid
  }
  return userRole === requiredRole;
};

const PrivateRoute = ({ element, path, requiredRole }) => {
  if (isAuthenticated(requiredRole)) {
    return element;
  } else {
    return <Navigate to="/auth/login" />;
  }
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/auth/signin' element={<SignInScreen></SignInScreen>} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
