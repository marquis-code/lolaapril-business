import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config'

export const auth_api = {
    register: (payload: {
        firstName: string
        lastName: string
        email: string
        phone: string
        password: string
    }) => {
        const url = "/auth/register"
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    login: (payload: { email: string; password: string }) => {
        const url = "/auth/login"
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    // 🆕 ADD THIS - For Google ID Token authentication
    googleAuth: (payload: { idToken: string; subdomain?: string }) => {
        // const url = "/auth/google/token"
        const url = '/auth/firebase'
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    getProfile: () => {
        const url = "/auth/profile"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    updateProfile: (payload: any) => {
        const url = "/auth/profile"
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },
    
    resetPassword: (payload: any) => {
        const url = "/auth/reset-password"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },
    
    verifyResetPasswordOtp: (payload: any) => {
        const url = "/auth/verify-reset-otp"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },
    
    forgotPassword: (payload: any) => {
        const url = "/auth/forgot-password"
        return GATEWAY_ENDPOINT.post(url, payload)
    },
    
    changePassword: (payload: any) => {
        const url = "/auth/change-password"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    }
}