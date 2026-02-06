import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios' // Using axios types directly

export default function useApi() {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase || 'http://localhost:3001'

    // Use Nuxt cookies for tokens to support SSR
    const accessToken = useCookie('accessToken')
    const refreshToken = useCookie('refreshToken')
    const businessId = useCookie('businessId')

    const api: AxiosInstance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    })

    api.interceptors.request.use(
        (config) => {
            if (accessToken.value) {
                config.headers.Authorization = `Bearer ${accessToken.value}`
            }

            if (businessId.value) {
                config.headers['X-Business-Id'] = businessId.value
            }

            return config
        },
        (error) => Promise.reject(error)
    )

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    if (refreshToken.value) {
                        const { data } = await axios.post(`${baseURL}/auth/refresh`, {
                            refreshToken: refreshToken.value
                        })

                        accessToken.value = data.accessToken
                        refreshToken.value = data.refreshToken

                        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
                        return api(originalRequest)
                    }
                } catch (refreshError) {
                    // Logout if refresh fails
                    accessToken.value = null
                    refreshToken.value = null
                    if (process.client) {
                        window.location.href = '/auth/login'
                    }
                }
            }
            return Promise.reject(error)
        }
    )

    return api
}
