import React from 'react'; // Import React
import Cookies from 'js-cookie'
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
  DashboardEmployeeManageUserScreens,
  DashboardManageNotification
} from './pages/EmployeeManagement';

import {
  ChangePasswordScreen,
  ForgotPassWordScreen,
  SignInScreen,
  SignUpScreen,
  VerifyEmailScreen,
} from './pages/Authentication';

import {
  DashboardBrandManageNotification,
  DashboardBrandProfileScreens,
  DashboardBrandScreens,
  DashboardManageMaterialScreen
} from './pages/BrandManagement';

import Screen404 from './pages/Error/Screen404';
import { ProductDetailScreens } from './pages/DetailProduct';


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
  const userAuth = localStorage.getItem('userAuth');
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
          <Route path='/auth/getpassword/:emailParam' element={<ForgotPassWordScreen></ForgotPassWordScreen>} />
          <Route path='/auth/changepassword/:email' element={<ChangePasswordScreen></ChangePasswordScreen>} />
          <Route path='/auth/verify/:email' element={<VerifyEmailScreen></VerifyEmailScreen>} />


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

          {/* Employee dashboard route */}
          <Route path='/employee' element={<DashboardEmployeeScreens></DashboardEmployeeScreens>} />
          <Route path='/manager_customer' element={<DashboardEmployeeManageUserScreens></DashboardEmployeeManageUserScreens>} />
          <Route path='/employee_profile' element={<DashboardEmployeeProfileScreens></DashboardEmployeeProfileScreens>} />
          <Route path='/manage_brand' element={<DashboardEmployeeManageBrandScreens></DashboardEmployeeManageBrandScreens>} />
          <Route path='/manage_report' element={<DashboardManageReportScreen></DashboardManageReportScreen>} />
          <Route path='/manager_order' element={<DashboardManageOrderScreen></DashboardManageOrderScreen>} />
          <Route path='/manage_transaction' element={<DashboardManageTransactionScreen></DashboardManageTransactionScreen>} />
          <Route path="/row-details" element={<DashboardEmployeeOrderDetailScreen></DashboardEmployeeOrderDetailScreen>} />
          <Route path="/manage_notification" element={<DashboardManageNotification></DashboardManageNotification>} />

          {/* Brand Dashboard Route */}
          <Route path='/brand' element={<DashboardBrandScreens></DashboardBrandScreens>} />
          <Route path="/brand_manage_notification" element={<DashboardBrandManageNotification></DashboardBrandManageNotification>} />
          <Route path='/brand_profile' element={<DashboardBrandProfileScreens></DashboardBrandProfileScreens>} />
          <Route path='/manage_material' element={<DashboardManageMaterialScreen></DashboardManageMaterialScreen>} />

          {/* Detail Product Route */}
          <Route path='/detail_product' element={<ProductDetailScreens></ProductDetailScreens>} />

          <Route path='*' element={<Screen404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
