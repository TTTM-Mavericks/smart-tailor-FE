import React from 'react'; // Import React

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import CustomDesignScreen from './pages/CustomDesign/CustomDesignScreen';
import AboutUsPage from './pages/AboutUs/AboutUsScreen';
import HomeScreen from './pages/Home/HomeScreen';
import ContactUsPage from './pages/ContactUs/ContactUsScreen';

import {
  DashboardAdminScreens,
  DashboardManageUserScreen,
  DashboardAdminProfileScreens,
  DashboardRecentTransactionScreen,
  DashboardManageInvoiceScreen,
  DashboardFAQScreens,
  DashboardPieChartScreens,
  DashboardGeographyChartScreens,
  DashboardLineChartScreens,
  DashboardBarChartScreens,
} from './pages/AdminManagement';

import {
  DashboardEmployeeProfileScreens,
  DashboardEmployeeScreens,
  DashboardEmployeeManageBrandScreens,
  DashboardManageReportScreen,
  DashboardManageOrderScreen,
  DashboardManageTransactionScreen,
  DashboardEmployeeOrderDetailScreen,
  DashboardEmployeeManageUserScreens
} from './pages/EmployeeManagement';

import {
  ForgotPassWordScreen,
  SignInScreen,
  SignUpScreen,
  VerifyEmailScreen
} from './pages/Authentication';

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

          {/* Init/Home route */}
          <Route path='/' element={<HomeScreen></HomeScreen>} />

          {/* Auth route */}
          <Route path='/auth/signin' element={<SignInScreen></SignInScreen>} />
          <Route path='/auth/signup' element={<SignUpScreen></SignUpScreen>} />
          <Route path='/auth/getpassword' element={<ForgotPassWordScreen></ForgotPassWordScreen>} />
          <Route path='/auth/verify' element={<VerifyEmailScreen></VerifyEmailScreen>} />

          {/* Design route */}
          <Route path='/design' element={<CustomDesignScreen></CustomDesignScreen>} />

          {/* Admin dashboard route */}
          <Route path='/admin' element={<DashboardAdminScreens></DashboardAdminScreens>} />
          <Route path='/admin_profile' element={<DashboardAdminProfileScreens></DashboardAdminProfileScreens>} />
          <Route path='/about' element={<AboutUsPage></AboutUsPage>} />
          <Route path='/contact' element={<ContactUsPage></ContactUsPage>} />
          <Route path='/manager_user' element={<DashboardManageUserScreen></DashboardManageUserScreen>} />
          <Route path='/manage_revenue' element={<DashboardRecentTransactionScreen></DashboardRecentTransactionScreen>} />
          <Route path='/manage_invoice' element={<DashboardManageInvoiceScreen></DashboardManageInvoiceScreen>} />
          <Route path='/admin_faq' element={<DashboardFAQScreens></DashboardFAQScreens>} />
          <Route path='/pie_chart' element={<DashboardPieChartScreens></DashboardPieChartScreens>} />
          <Route path='/geography_chart' element={<DashboardGeographyChartScreens></DashboardGeographyChartScreens>} />
          <Route path='/line_chart' element={<DashboardLineChartScreens></DashboardLineChartScreens>} />
          <Route path='/bar_chart' element={<DashboardBarChartScreens></DashboardBarChartScreens>} />

          {/* Employee dashboard route */}
          <Route path='/employee' element={<DashboardEmployeeScreens></DashboardEmployeeScreens>} />
          <Route path='/manager_customer' element={<DashboardEmployeeManageUserScreens></DashboardEmployeeManageUserScreens>} />
          <Route path='/employee_profile' element={<DashboardEmployeeProfileScreens></DashboardEmployeeProfileScreens>} />
          <Route path='/manage_brand' element={<DashboardEmployeeManageBrandScreens></DashboardEmployeeManageBrandScreens>} />
          <Route path='/manage_report' element={<DashboardManageReportScreen></DashboardManageReportScreen>} />
          <Route path='/manager_order' element={<DashboardManageOrderScreen></DashboardManageOrderScreen>} />
          <Route path='/manage_transaction' element={<DashboardManageTransactionScreen></DashboardManageTransactionScreen>} />
          <Route path="/row-details" element={<DashboardEmployeeOrderDetailScreen></DashboardEmployeeOrderDetailScreen>} />





        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
