import React from 'react'; // Import React
import Cookies from 'js-cookie'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import CustomDesignScreen from './pages/CustomDesign/CustomDesignScreen';
import AboutUsPage from './pages/AboutUs/AboutUsScreen';
import HomeScreen from './pages/Home/HomeScreen';
import ContactUsPage from './pages/ContactUs/ContactUsScreen';

import {
  DashboardAdminScreens,
  DashboardAdminManageMaterialScreen,
  DashboardAdminProfileScreens,
  DashboardRecentTransactionScreen,
  DashboardManageInvoiceScreen,
  DashboardFAQScreens,
  DashboardPieChartScreens,
  DashboardGeographyChartScreens,
  DashboardLineChartScreens,
  DashboardBarChartScreens,
  DashboardAdminManageCategoryScreen,
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
  ProfileSettings,
  SignInScreen,
  SignUpScreen,
  TokenRefreshDialogComponent,
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
import { FilterProductScreen } from './pages/FilterProduct';

import {
  OrderDetailScreen,
  OrderHistory,
  OrderProductScreen
} from './pages/Order';

import Brand from './pages/BrandManagement/DashboardBrand/BrandDashboardScreen';

import {
  DashboardManagerMangeBrand,
  DashboardManagerMangeCustomer,
  DashboardManagerMangeEmployee,
  DashboardManagerMangeExpertTailoring,
  DashboardManagerMangeTask,
  FeedbackComponent
} from './pages/ManagerManagement';


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


const ConditionalTokenRefreshDialog = () => {
  const location = useLocation();

  const hideOnRoutes = [
    '/auth/signin',
    '/auth/signup',
    '/auth/getpassword',
    '/auth/changepassword',
    '/auth/verify',
  ];

  const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

  return !shouldHide ? <TokenRefreshDialogComponent /> : null;
};


function App() {
  return (
    <div>
      <BrowserRouter>
        <ConditionalTokenRefreshDialog />
        <Routes>

          {/* Init/Home route */}
          <Route index element={<HomeScreen></HomeScreen>} />

          {/* Auth route */}
          <Route path='/auth/signin' element={<SignInScreen></SignInScreen>} />
          <Route path='/auth/signup' element={<SignUpScreen></SignUpScreen>} />
          <Route path='/auth/getpassword/:emailParam' element={<ForgotPassWordScreen></ForgotPassWordScreen>} />
          <Route path='/auth/changepassword/:email' element={<ChangePasswordScreen></ChangePasswordScreen>} />
          <Route path='/auth/verify/:email' element={<VerifyEmailScreen></VerifyEmailScreen>} />
          <Route path='/auth/profilesetting' element={<ProfileSettings></ProfileSettings>} />


          {/* Design route */}
          {/* <Route path="/design" element={<PrivateRoute element={<CustomDesignScreen />} requiredRole="CUSTOMER" />} /> */}
          <Route path='/design' element={<CustomDesignScreen></CustomDesignScreen>} />


          {/* Admin dashboard route */}
          <Route path='/admin' element={<DashboardAdminScreens></DashboardAdminScreens>} />
          <Route path='/admin_profile' element={<DashboardAdminProfileScreens></DashboardAdminProfileScreens>} />
          <Route path='/about' element={<AboutUsPage></AboutUsPage>} />
          <Route path='/contact' element={<ContactUsPage></ContactUsPage>} />
          <Route path='/admin_manage_material' element={<DashboardAdminManageMaterialScreen></DashboardAdminManageMaterialScreen>} />
          <Route path='/admin_manage_category' element={<DashboardAdminManageCategoryScreen></DashboardAdminManageCategoryScreen>} />
          <Route path='/admin_manage_revenue' element={<DashboardRecentTransactionScreen></DashboardRecentTransactionScreen>} />
          <Route path='/admin_manage_invoice' element={<DashboardManageInvoiceScreen></DashboardManageInvoiceScreen>} />
          <Route path='/admin_faq' element={<DashboardFAQScreens></DashboardFAQScreens>} />
          <Route path='/pie_chart' element={<DashboardPieChartScreens></DashboardPieChartScreens>} />
          <Route path='/geography_chart' element={<DashboardGeographyChartScreens></DashboardGeographyChartScreens>} />
          <Route path='/line_chart' element={<DashboardLineChartScreens></DashboardLineChartScreens>} />
          <Route path='/bar_chart' element={<DashboardBarChartScreens></DashboardBarChartScreens>} />

          {/* Employee dashboard route */}
          <Route path='/employee' element={<DashboardEmployeeScreens></DashboardEmployeeScreens>} />
          <Route path='/employee_manage_customer' element={<DashboardEmployeeManageUserScreens></DashboardEmployeeManageUserScreens>} />
          <Route path='/employee_manage_brand' element={<DashboardEmployeeManageBrandScreens></DashboardEmployeeManageBrandScreens>} />
          <Route path='/employee_manage_report' element={<DashboardManageReportScreen></DashboardManageReportScreen>} />
          <Route path='/employee_manage_order' element={<DashboardManageOrderScreen></DashboardManageOrderScreen>} />
          <Route path='/employee_manage_transaction' element={<DashboardManageTransactionScreen></DashboardManageTransactionScreen>} />
          <Route path="/employee_manage_notification" element={<DashboardManageNotification></DashboardManageNotification>} />
          <Route path='/employee_profile' element={<DashboardEmployeeProfileScreens></DashboardEmployeeProfileScreens>} />
          <Route path="/row-details" element={<DashboardEmployeeOrderDetailScreen></DashboardEmployeeOrderDetailScreen>} />

          {/* Brand Dashboard Route */}
          <Route path='/brand' element={<DashboardBrandScreens></DashboardBrandScreens>} />
          <Route path='/brands' element={<Brand />} />
          <Route path="/brand_manage_notification" element={<DashboardBrandManageNotification></DashboardBrandManageNotification>} />
          <Route path='/brand_profile' element={<DashboardBrandProfileScreens></DashboardBrandProfileScreens>} />
          <Route path='/manage_material' element={<DashboardManageMaterialScreen></DashboardManageMaterialScreen>} />

          {/* Detail Product Route */}
          <Route path='/detail_product/:id' element={<ProductDetailScreens></ProductDetailScreens>} />
          <Route path='/product' element={<FilterProductScreen></FilterProductScreen>} />

          {/* Order Detail Route */}
          <Route path='/order_detail' element={<OrderDetailScreen></OrderDetailScreen>} />
          <Route path='/order_history' element={<OrderHistory></OrderHistory>} />
          <Route path='/order' element={<OrderProductScreen></OrderProductScreen>} />


          {/* Manager dashboard route */}
          <Route path='/manager' element={<DashboardManagerMangeExpertTailoring />} />
          <Route path='/manager_manage_employee' element={<DashboardManagerMangeEmployee />} />
          <Route path='/manager_manage_customer' element={<DashboardManagerMangeCustomer />} />
          <Route path='/manager_manage_brand' element={<DashboardManagerMangeBrand />} />
          <Route path='/manager_manage_task' element={<DashboardManagerMangeTask />} />
          <Route path='/manager_manage_employee_report' element={<FeedbackComponent />} />


          <Route path='*' element={<Screen404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
