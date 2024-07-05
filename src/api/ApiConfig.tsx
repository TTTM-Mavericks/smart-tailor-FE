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
  brand_material: '/brand-material',
  customer: '/customer',
  admin: '/admin',
  material: '/material',
  category: '/category',
  manager: '/expert-tailoring',
  labor_quantity: '/labor-quantity',
  size: '/size',
  brand_labor_quantity: '/brand-labor-quantity'
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
    systemItem: '/systemItem'
  },
  brand: {
    addExcel: '/add-new-brand-material-by-excel-file',
    addManual: '/add-new-brand-material'
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
    downloadSampleBrandPriceExcelData: '/export-category-material-for-brand-by-excel'
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
    updateLaborQuantity: '/update-labor-quantity'
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

  put: async (url: string, data: any, accessToken?: string) => {
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