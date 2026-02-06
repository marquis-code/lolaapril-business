
import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/modules/auth/user";
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useTokenManager } from '@/composables/core/useTokenManager'

const { showToast } = useCustomToast();
const { token, logOut } = useUser();
const tokenManager = useTokenManager();

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = import.meta.env.VITE_BASE_URL as string;
const $GATEWAY_ENDPOINT = import.meta.env.VITE_BASE_URL;
const $GATEWAY_ENDPOINT_V2 = import.meta.env.VITE_BASE_URL + "/v2";
const $IMAGE_UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string;

// Helper function to redirect to login page
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    // Clear any stored auth data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Dispatch auth change event for other components
    window.dispatchEvent(new Event('auth-change'));
    
    // Redirect to login page if not already there
    if (!window.location.pathname.includes('/auth/login')) {
      window.location.href = '/auth/login';
    }
  }
};

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});
export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});
export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "multipart/form-data",
  },
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
];

instanceArray.forEach((instance) => {
  instance.interceptors.request.use((config: any) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      if (typeof err.response === "undefined") {
        showToast({
          title: "Error",
          message: "kindly check your network connection",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      }
      if (err.response.status === 401) {
        const originalRequest = err.config;
        
        // Don't retry if this was already a retry or if it's a refresh token request
        if (originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
          logOut();
          showToast({
            title: "Session Expired",
            message: "Please login again",
            toastType: "error",
            duration: 3000
          });
          redirectToLogin();
          return Promise.reject(err);
        }

        originalRequest._retry = true;

        // If token refresh is already in progress, queue this request
        if (tokenManager.isTokenRefreshing()) {
          return tokenManager.queueFailedRequest()
            .then(newToken => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance(originalRequest);
            })
            .catch(error => Promise.reject(error));
        }

        // Attempt to refresh the token
        return tokenManager.refreshAccessToken($GATEWAY_ENDPOINT)
          .then(newAccessToken => {
            console.log('Token refreshed, updating useUser token ref');
            
            // Update the token ref for useUser to sync state
            token.value = newAccessToken;
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          })
          .catch(refreshError => {
            console.error('Token refresh failed in interceptor, logging out');
            
            // Clear tokens only after refresh fails
            tokenManager.clearTokens();
            
            // Log out user
            logOut();
            
            showToast({
              title: "Session Expired",
              message: "Please login again",
              toastType: "error",
              duration: 3000
            });
            
            // Redirect to login page
            redirectToLogin();
            
            return Promise.reject(refreshError);
          });
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        if (err.response.data.message) {
          showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 500) {
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 409) {
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
      }
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};
