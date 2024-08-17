import axios, { AxiosRequestConfig } from 'axios';
import { asyncDispose } from 'core-js/fn/symbol';
import { jwtDecode } from 'jwt-decode';


// const baseURL = 'https://whear-app.azurewebsites.net';
// const baseURL = 'https://tam.mavericks-tttm.studio';
// export const baseURL = 'https://be.mavericks-tttm.studio';
// export const baseURL = 'https://dev01.smart-tailor.live';

export const baseURL = 'http://localhost:6969';
export const googleOAuth2 = '/oauth2/authorization/google'
export const versionEndpoints = {
  v1: '/api/v1',
  v2: '/api/v2'
}
export const featuresEndpoints = {
  auth: '/auth',
  design: 'design',
  designDetail: '/design-detail',
  brand_material: '/brand-material',
  customer: '/customer',
  admin: '/admin',
  material: '/material',
  category: '/category',
  manager: '/expert-tailoring',
  labor_quantity: '/labor-quantity',
  size: '/size',
  brand_labor_quantity: '/brand-labor-quantity',
  order: '/order',
  sizeExpertTailoring: '/size-expert-tailoring',
  expertTailoring: '/expert-tailoring',
  expertTailoringMaterial: '/expert-tailoring-material',
  brand: '/brand',
  user: '/user',
  systemImage: '/system-image',
  report: '/report',
  systemPropertise: '/system-property',
  brandPropertise: '/brand-property',
  SampleProduct: '/sample-product-data',
  notification: '/notification',
  payment: '/payment',

}
export const functionEndpoints = {
  auth: {
    signin: '/login',
    signup: '/register',
    forgot: '/forgot-password',
    updatePassword: '/update-password',
    checkVerify: '/check-verify-account',
    checkVerifyPassword: '/check-verify-forgot-password',
    signout: '/log-out',
    resendVerificationToken: '/resend-verification-token',
    refreshToken: '/refresh-token'
  },
  design: {
    systemItem: '/systemItem',
    addNewDesign: '/add-new-design',
    getDesignByID: '/get-design-by-id',
    getAllDesign: '/get-all-design',
    updateDesign: '/update-design',
    getAllDesignByUserID: '/get-all-design-by-user-id'
  },
  designDetail: {
    addNewDesignDetail: '/add-new-design-detail',
    getAllInforOrderDetail: '/get-all-design-detail-by-order-id',
    getTotalPriceByParentOrderId: '/calculate-total-price-by-parent-order-id'
  },
  brand: {
    addExcel: '/add-new-brand-material-by-excel-file',
    addManual: '/add-new-brand-material',
    updateBrandMaterial: '/update-brand-material',
    brandSignUp: '/add-new-brand',
    uploadBrandInfor: '/upload-brand-infor',
    acceptBrand: '/accept-brand',
    rejectBrand: '/reject-brand',
    getBrandByID: '/get-brand',
    getBrandInformationByBrandID: '/get-brand-information-by-brand-id',
    getAllBrandInformation: '/get-all-brand-information'
  },
  customer: {
    updateProfile: '/update-customer-profile'
  },
  admin: {
    dashboard: '/dashboard',
  },
  manager: {
    addNewExpertTailoring: '/add-new-expert-tailoring',
    updateExpertTailoring: '/update-expert-tailoring',
    updateStatusExpertTailoring: '/update-status-expert-tailoring',
    addNewExpertTailoringByExcelFile: '/add-new-expert-tailoring-by-excel-file',
    getAllExpertTailoring: '/get-all-expert-tailoring',
    getExpertTailoringByID: '/get-expert-tailoring-by-id',
    exportAllExpertTailoringByExcel: '/get-all-expert-tailoring-by-excel-file',
    downloadSampleExcelExpertTailoring: '/generate-sample-expert-tailoring-by-excel-file',
    getExpertTailoringByName: '/get-expert-tailoring-by-name'
  },
  material: {
    addNewMaterial: '/add-new-material',
    getAllMaterial: '/get-all-material',
    getAllMaterialByBrandName: '/get-all-brand-material-by-brand-name',
    updateMaterial: '/update-material',
    updateStatusMaterial: '/update-status-material',
    addNewMaterialByExcelFile: '/add-new-category-material-by-excel-file',
    downloadSampleDataExcelFile: '/generate-sample-category-material-by-excel-file',
    downloadSampleBrandPriceExcelData: '/export-category-material-for-brand-by-excel',
    getListMaterialByCategoryByID: '/get-list-material-by-category-id',
    getListMaterialByCategoryAndExpert: '/get-list-material-by-expert-tailoring-id-and-category-id',
    getAllBrandMaterialByBrandID: '/get-all-brand-material-by-brand-id'
  },
  category: {
    addNewCategory: '/add-new-category',
    updateCategory: '/update-category',
    getCategoryById: '/get-category-by-id',
    getAllCategory: '/get-all-category'
  },
  laborQantity: {
    getAllLaborQuantity: '/get-all-labor-quantity',
    addNewLaborQuantity: '/add-new-labor-quantity',
    updateLaborQuantity: '/update-labor-quantity',
    getAllLaborQuantityByBrandID: '/get-all-brand-labor-quantity-by-brand-id'
  },
  size: {
    getAllSize: '/get-all-size',
    addNewSize: '/add-new-size',
    updateSize: '/update-size'
  },
  brandLaborQuantity: {
    getAllBrandLaborQuantity: '/get-all-brand-labor-quantity-by-brand-id',
    addNewBrandLaborQuantity: '/add-new-brand-labor-quantity',
    updateBrandLaborQuantity: '/update-brand-labor-quantity'
  },
  order: {
    createOrder: '/create-order',
    getOrderById: '/get-order-by-id',
    brandPickOrder: '/brand-pick_order',
    getOrderDetailById: '/get-order-detail-by-id',
    getOrderByBrandId: '/get-order-by-brand-id',
    getAllOrder: '/get-all-order',
    getOrderByUserId: '/get-order-by-user-id',
    changeOrderStatus: '/change-order-status',
    getAllSubOrder: '/get-all-order',
    getDeliveredOrder: '/get-all-delivery-order',
    getOrderStageById: '/get-order-stage-by-id',
    getOrderTimeLineByParentId: '/order-time-line-by-parent-order-id',
    getFullOrderAccountant: '/get-full-of-order',
    ratingOrder: '/rating-order',
    getBrandTransactions: '/get-full-of-order-by-brand-id'
  },
  sizeExpertTailoring: {
    getAllSizeExpertTailoringByExperId: '/get-all-size-by-expert-tailoring-id',
    getAllSizeExpertTailoring: '/get-all-size-expert-tailoring',
    generateSizeExpertTailoringSample: '/generate-sample-size-expert-tailoring-by-excel-file',
    addNewSizeExpertTailoring: '/add-new-size-expert-tailoring',
    addNewSizeExpertTailoringByExcel: '/add-new-size-expert-tailoring-by-excel-file',
    updateSizeExpertTailoring: '/update-size-expert-tailoring',
  },
  expertTailoring: {
    getAllExpertTailoring: '/get-all-expert-tailoring',
  },
  expertTailoringMaterial: {
    getAllExpertTailoringMaterial: '/get-all-expert-tailoring-material',
    getAllExpertTailoringMaterialByExpertTailoringId: '/get-all-expert-tailoring-material-by-expert-tailoring-id',
    getAllExpertTailoringMaterialByExpertTailoringName: '/get-all-expert-tailoring-material-by-expert-tailoring-name',
    generateSampleFile: '/generate-sample-category-material-expert-tailoring-by-excel-file',
    addNewExpertTailoringMaterial: '/add-new-expert-tailoring-material',
    addNewExpertTailoringByExcelFile: '/add-new-expert-tailoring-material-by-excel-file',
    updateStatusExpertTailoringMaterial: '/change-status-expert-tailoring-material'
  },
  user: {
    getAllCustomer: '/get-all-customer',
    getAllBrand: '/get-all-brand',
    getAllAccountant: '/get-all-accountant',
    getAllEmployee: '/get-all-employee',
    getAllManager: '/get-all-manager'
  },
  systemImage: {
    getAllSystemIamge: '/get-all-system-image',

  },
  report: {
    getAllReport: '/get-all-report',
    createReport: '/create-report',
    getReportByOrderID: '/get-all-report-by-order-id',
    createOrderReport: '/create-report',
    getReportByUserID: '/get-all-report-by-user-id',

  },
  systemPropertise: {
    getAllSystemPropertise: '/get-all-system-properties',
    updateSystemPropertise: '/update-system-property',
    addSystemPropertise: '/add-new-system-property'
  },
  brandPropertise: {
    addNewBrandPropertise: '/add-new-brand-property'
  },
  SampleProduct: {
    addSampleProduct: '/add-sample-product-data',
    getSamplePriductByParentOrderID: '/get-sample-product-data-by-parent-order-id',
    updateSampleProductStatus: '/update-sample-product-data',
    getsampleProductDataByParentOrderId: '/get-sample-product-data-by-parent-order-id'
  },
  notification: {
    getNotiByUserId: '/get-all-notification-user-id',
    updateReadStatus: '/update-notification-status',
    sendNoti: '/send-notification'
  },
  payment: {
    getPaymentByUserID: '/get-payment-by-user-id'
  },
  chart: {
    orderStatusDetail: '/get-order-status-detail',
    calculateOrderGrowthPercentageMonth: '/calculate-order-growth-percentage-for-current-and-previous-month',
    getTotalForEachMonth: '/get-total-payment-of-each-month',
    getTotalForEachBrand: '/get-order-detail-of-each-brand',
    calculatePaymentGrowthPercentageMonth: '/calculate-payment-growth-percentage-for-current-and-previous-week',
    calculateUserGrowthPercentageMonth: '/calculate-user-growth-percentage-for-current-and-previous-month',
    calculateCustomerGrowthPercentageMonth: '/calculate-new-customer-growth-percentage-for-current-and-previous-week',
    calculateNewUserGrowthPercentageByRoleName: '/calculate-new-user-growth-percentage-for-current-and-previous-day-by-role-name',
    calculateCustomerGrowthPercentageWeek: '/calculate-new-customer-growth-percentage-for-current-and-previous-week',
    calculateUserGrowthPercentageWeek: '/calculate-user-growth-percentage-for-current-and-previous-week',
    calculateTotalOfUser: '/calculate-total-of-user',
    calculatePaymentGrowthPercentageWeek: '/calculate-payment-growth-percentage-for-current-and-previous-week',
    calculateIncomeGrowthPercentageWeek: '/calculate-income-growth-percentage-for-current-and-previous-week',
    calculateRefundGrowthPercentageMonth: '/calculate-refund-growth-percentage-for-current-and-previous-month',
    getTotalPaymentForEachMonth: "/get-total-payment-of-each-month",
    getTotalRefundForEachMonth: '/get-total-refund-of-each-month',
    getTotalIncomeForEachMonth: '/get-total-income-of-each-month',

  }
}


const axiosInstance = axios.create({
  baseURL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  get: async (url: string, params?: any, accessToken?: string) => {
    try {
      const response = await axiosInstance.get(url, getRequestConfig(accessToken, params));
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  post: async (url: string, data?: any, accessToken?: string) => {
    try {
      const response = await axiosInstance.post(url, data, getRequestConfig(accessToken));
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  put: async (url: string, data?: any, accessToken?: string) => {
    try {
      const response = await axiosInstance.put(url, data, getRequestConfig(accessToken));
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  delete: async (url: string, accessToken?: string) => {
    try {
      const response = await axiosInstance.delete(url, getRequestConfig(accessToken));
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },
};

const handleRequestError = (error: any) => {
  console.error('API Request Error:', error);

  throw error;
};

// Helper function to get request configuration with access token in headers
const getRequestConfig = (accessToken?: string, params?: any): AxiosRequestConfig => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = "Bearer " + `${accessToken}`;
  }

  return {
    headers,
    params,
  };
};

/**
 * Check validate token
 * @param token 
 * @returns 
 */
export const tokenIsValid = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    const expiration = decoded.exp;
    return expiration && expiration > Math.floor(Date.now() / 1000);
  } catch (error) {
    return false;
  }
};

/**
 * Check validate token
 * @param token 
 * @returns 
 */
export const isAuthenticated = (token: any) => {

  if (!tokenIsValid(token)) {
    return false;
  } else return true
}

export default api;