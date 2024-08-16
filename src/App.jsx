import Cookies from 'js-cookie'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import CustomDesignScreen from './pages/CustomDesign/CustomDesignScreen';
import HomeScreen from './pages/Home/HomeScreen';

import { DashboardAdminScreens } from './pages/AdminManagement';

import { DashboardEmployeeScreens, DashboardEmployeeOrderDetailScreen } from './pages/EmployeeManagement';

import {
  ChangePasswordScreen,
  ForgotPassWordScreen,
  ProfileSettings,
  SignInScreen,
  SignUpScreen,
  TokenRefreshDialogComponent,
  VerifyEmailScreen,
} from './pages/Authentication';

import { BrandSignUpScreen, DashboardManageMaterialScreen, OrderRequestScreen, UploadBrandInforForm, WaitingProcessComponent } from './pages/BrandManagement';

import Screen404 from './pages/Error/Screen404';
import { ProductDetailScreens } from './pages/DetailProduct';
import { FilterProductScreen } from './pages/FilterProduct';

import {
  OrderDetailScreen,
  OrderHistory,
  OrderProductScreen,
  PickedOrderScreen,
  RefundTransactionHistoryScreen
} from './pages/Order';

import { DashboardManagerMangeExpertTailoring } from './pages/ManagerManagement';
import Brand from './pages/BrandManagement/DashboardBrand/BrandDashboardScreen';


import CreateDesignComponent from './pages/CustomDesign/Components/CreateDesign/CreateDesignComponent';
import DesignCollectionScreen from './pages/DesignCollection/DesignCollectionContainer/DesignCollectionScreen';
import { DashboardAccountantScreens } from './pages/AccountantManagement';
import ToogleComponent from './pages/AccountantManagement/GlobalComponent/Toogle/ToogleComponent';
import ReportHistorySreen from './pages/Order/ReportHistory/ReportHistorySreen';
import AboutUs from './pages/AboutUs/test';
import NotificationComponent from './components/Notification/NotificationComponent';
import AllTransactionHistoryComponent from './pages/Order/AllTransactionHistory/AllTransactionHistoryComponent';
import ManageInvoiceScreen from './pages/AdminManagement/ManageInvoice/ManageInvoiceScreens';




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
  const userAuth = Cookies.get('userAuth');
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

export const __getToken = () => {
  const tokenStorage = Cookies.get('token');
  if (!tokenStorage) {
    return;
  } else
    return tokenStorage
}

export const __getUserLogined = () => {
  const userAuth = Cookies.get('userAuth');
  if (userAuth) {
    return JSON.parse(userAuth);
  } else return;
}

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
          <Route path='/design/:id' element={<CustomDesignScreen></CustomDesignScreen>} />
          <Route path='/design_create' element={<CreateDesignComponent></CreateDesignComponent>} />

          {/* Admin dashboard route */}
          <Route path='/admin' element={<PrivateRoute element={<DashboardAdminScreens></DashboardAdminScreens>} requiredRole="ADMIN" />} />

          {/* Employee dashboard route */}
          <Route path='/employee' element={<PrivateRoute element={<DashboardEmployeeScreens></DashboardEmployeeScreens>} requiredRole="EMPLOYEE" />} />
          <Route path="/row-details" element={<DashboardEmployeeOrderDetailScreen></DashboardEmployeeOrderDetailScreen>} />

          {/* Brand Dashboard Route */}
          <Route path='/brand' element={<PrivateRoute element={<DashboardManageMaterialScreen></DashboardManageMaterialScreen>} requiredRole="BRAND" />} />
          <Route path='/brand/signup' element={<BrandSignUpScreen></BrandSignUpScreen>} />
          <Route path='/brand/updateProfile/:id' element={<UploadBrandInforForm></UploadBrandInforForm>} />
          <Route path='/brand/manage_order_request/:id' element={<PrivateRoute element={<OrderRequestScreen></OrderRequestScreen>} requiredRole="BRAND" />} />
          <Route path='/brand/waiting_process_information' element={<WaitingProcessComponent></WaitingProcessComponent>} />

          {/* Detail Product Route */}
          <Route path='/detail_product/:id' element={<ProductDetailScreens></ProductDetailScreens>} />
          <Route path='/product' element={<FilterProductScreen></FilterProductScreen>} />

          {/* Order Detail Route */}
          <Route path='/order_detail/:id' element={<OrderDetailScreen></OrderDetailScreen>} />
          <Route path='/order_history' element={<OrderHistory></OrderHistory>} />
          <Route path='/design_detail/:id' element={<OrderProductScreen></OrderProductScreen>} />
          <Route path='/report_history' element={<ReportHistorySreen></ReportHistorySreen>} />
          <Route path='/refund_history' element={<RefundTransactionHistoryScreen></RefundTransactionHistoryScreen>} />
          <Route path='/transaction_history' element={<AllTransactionHistoryComponent></AllTransactionHistoryComponent>} />




          {/* Manager dashboard route */}
          <Route path='/manager' element={<DashboardManagerMangeExpertTailoring />} />

          <Route path='*' element={<Screen404 />} />
          <Route path='error404' element={<Screen404 />} />
          <Route path='/pickedOrder' element={<PickedOrderScreen />} />

          {/* Manage design */}
          <Route path='/collection' element={<DesignCollectionScreen />} />

          {/* Accountant dashboard route */}
          <Route path='/accountant' element={<DashboardAccountantScreens></DashboardAccountantScreens>} />

          {/* Test */}
          <Route path='/test' element={<ToogleComponent></ToogleComponent>} />
          <Route path='/bs' element={<AboutUs />} />
          <Route path='/notification' element={<NotificationComponent></NotificationComponent>} />
          <Route path='/invoice' element={<ManageInvoiceScreen></ManageInvoiceScreen>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
