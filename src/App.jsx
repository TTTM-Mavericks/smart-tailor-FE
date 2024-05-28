import React from 'react'; // Import React

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import CustomDesignScreen from './pages/CustomDesign/CustomDesignScreen';
import DashboardAdminScreens from './pages/AdminManagement/DashboardAdmin/DashboardAdminScreens';
import DashboardAdminProfileScreens from './pages/AdminManagement/AdminProfile/AdminProfileComponent';
import AboutUsPage from './pages/AboutUs/AboutUsScreen';
import HomeScreen from './pages/Home/HomeScreen';
import ContactUsPage from './pages/ContactUs/ContactUsScreen';
import DashboardManageUserScreen from './pages/AdminManagement/ManageUsers/DashBoardManageUserComponent';
import DashboardRecentTransactionScreen from './pages/AdminManagement/RecentTransaction/DashboardRecentTransactionComponent';
import DashboardManageInvoiceScreen from './pages/AdminManagement/ManageInvoice/DashboardManageInvoiceComponent';
import DashboardFAQScreens from './pages/AdminManagement/GlobalComponent/FAQ/DashboardFAQComponent';
import DashboardPieChartScreens from './pages/AdminManagement/PieChart/DashboardPieChartComponent';
import DashboardGeographyChartScreens from './pages/AdminManagement/GeographyChart/DashboardGeographyChartComponent';
import DashboardLineChartScreens from './pages/AdminManagement/LineChart/DashboardLineChartComponent';
import DashboardBarChartScreens from './pages/AdminManagement/BarChart/DashboardBarChartComponent';
import DashboardEmployeeProfileScreens from './pages/EmployeeManagement/EmployeeProfile/EmployeeProfileDashboardComponent';
import DashboardEmployeeScreens from './pages/EmployeeManagement/DashboardEmployee/DashboardEmployeeScreen';
import DashboardEmployeeManageUserScreen from './pages/EmployeeManagement/ManageCustomer/DashboardEmployeeComponent';
import DashboardEmployeeManageBrandScreens from './pages/EmployeeManagement/ManageBrand/DashboardEmployeeManageBrandComponent';
import DashboardManageReportScreen from './pages/EmployeeManagement/ManageReport/DashboardManageReportComponent';
import DashboardManageOrderScreen from './pages/EmployeeManagement/ManageOrder/DashboardManageOrderComponent';
import DashboardManageTransactionScreen from './pages/EmployeeManagement/ManageOrder/DashboardManageOrderComponent';
import {
  ForgotPassWordScreen,
  SignInScreen,
  SignUpScreen,
  VerifyEmailScreen
} from './pages/Authentication';
import RowDetails from './pages/EmployeeManagement/ManageOrder/RowDetailsComponent';
import EmployeeManageOrder from './pages/EmployeeManagement/ManageOrder/ManageOrderScreen';

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
          <Route path='/employee' element={<DashboardEmployeeScreens></DashboardEmployeeScreens>} />
          <Route path='/manager_customer' element={<DashboardEmployeeManageUserScreen></DashboardEmployeeManageUserScreen>} />
          <Route path='/employee_profile' element={<DashboardEmployeeProfileScreens></DashboardEmployeeProfileScreens>} />
          <Route path='/manage_brand' element={<DashboardEmployeeManageBrandScreens></DashboardEmployeeManageBrandScreens>} />
          <Route path='/manage_report' element={<DashboardManageReportScreen></DashboardManageReportScreen>} />
          <Route path='/manager_order' element={<DashboardManageOrderScreen></DashboardManageOrderScreen>} />
          <Route path='/manage_transaction' element={<DashboardManageTransactionScreen></DashboardManageTransactionScreen>} />
          <Route path="/be" element={<EmployeeManageOrder />} />
          <Route path="/row-details" element={<RowDetails />} />





        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
