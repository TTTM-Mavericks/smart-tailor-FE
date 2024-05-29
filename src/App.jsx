import React from 'react'; // Import React
import Cookies from 'js-cookie'
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
import {
  ForgotPassWordScreen,
  SignInScreen,
  SignUpScreen,
  VerifyEmailScreen
} from './pages/Authentication';
import Screen404 from './pages/Error/Screen404';

const tokenIsValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const expiration = decoded.exp; 

    return expiration > Math.floor(Date.now() / 1000);
  } catch (error) {
    return false;
  }
};



const isAuthenticated = (requiredRole) => {
  const token = Cookies.get('token');
  console.log('token: ', token);
  const userAuth = sessionStorage.getItem('userAuth');
  if (userAuth) {
    const userParse = JSON.parse(userAuth);
    return userParse.roleName === requiredRole
  }

  if (!tokenIsValid(token)) {
    return false;
  }
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
          <Route exact path='/' element={<HomeScreen></HomeScreen>} />

          {/* Auth route */}
          <Route path='/auth/signin' element={<SignInScreen></SignInScreen>} />
          <Route path='/auth/signup' element={<SignUpScreen></SignUpScreen>} />
          <Route path='/auth/getpassword' element={<ForgotPassWordScreen></ForgotPassWordScreen>} />
          <Route path='/auth/verify' element={<VerifyEmailScreen></VerifyEmailScreen>} />

          {/* Design route */}
          <Route path="/design" element={<PrivateRoute element={<CustomDesignScreen />} requiredRole="CUSTOMER" />} />

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





          <Route path='*' element={<Screen404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
