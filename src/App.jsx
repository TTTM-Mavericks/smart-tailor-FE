import React from 'react'; // Import React

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import CustomDesignScreen from './pages/CustomDesign/CustomDesignScreen';
import SignInScreen from './pages/Authentication/SignIn/SignInScreens';
import DashboardAdminScreens from './pages/AdminManagement/DashboardAdmin/DashboardAdminScreens';
import DashboardAdminProfileScreens from './pages/AdminManagement/AdminProfile/AdminProfileComponent';
import AboutUsPage from './pages/AboutUs/AboutUsScreen';
import HomeScreen from './pages/Home/HomeScreen';
import ContactUsPage from './pages/ContactUs/ContactUsScreen';
import DashboardManageUserScreen from './pages/AdminManagement/ManageUsers/DashBoardManageUserComponent';
import DashboardRecentTransactionScreen from './pages/AdminManagement/RecentTransaction/DashboardRecentTransactionComponent';

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
    return <Navigate to="/auth/signin" />;
  }
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeScreen></HomeScreen>} />
          <Route path='/design' element={<CustomDesignScreen></CustomDesignScreen>} />
          <Route path='/auth/signin' element={<SignInScreen></SignInScreen>} />
          <Route path='/admin' element={<DashboardAdminScreens></DashboardAdminScreens>} />
          <Route path='/admin_profile' element={<DashboardAdminProfileScreens></DashboardAdminProfileScreens>} />
          <Route path='/about' element={<AboutUsPage></AboutUsPage>} />
          <Route path='/contact' element={<ContactUsPage></ContactUsPage>} />
          <Route path='/manager_user' element={<DashboardManageUserScreen></DashboardManageUserScreen>} />
          <Route path='/manage_revenue' element={<DashboardRecentTransactionScreen></DashboardRecentTransactionScreen>} />





        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
