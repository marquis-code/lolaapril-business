import type { BusinessLoginDto, BusinessRegisterDto, AuthResponse, User } from '~/types/auth'
import { auth_api } from '~/api_factory/modules'
import { useTokenManager } from '@/composables/core/useTokenManager'

export const useAuth = () => {
    const user = useState<User | null>('user', () => null)
    const isAuthenticated = computed(() => !!user.value)
    const router = useRouter()
    const tokenManager = useTokenManager()

    // Login
    const login = async (credentials: BusinessLoginDto) => {
        try {
            const { data } = await auth_api.login(credentials)
            setAuth(data)
            return data
        } catch (error) {
            throw error
        }
    }

    // Register
    const register = async (payload: BusinessRegisterDto) => {
        try {
            const { data } = await auth_api.register(payload)
            setAuth(data)
            return data
        } catch (error) {
            throw error
        }
    }

    // Logout
    const logout = async () => {
        try {
            await auth_api.logout()
        } catch (e) {
            // Ignore error on logout
        } finally {
            clearAuth()
            router.push('/auth/login')
        }
    }

    // Helper to set auth state
    const setAuth = (data: AuthResponse) => {
        user.value = data.user

        // Set cookies for SSR/client side
        const accessToken = useCookie('accessToken')
        const refreshToken = useCookie('refreshToken')

        accessToken.value = data.accessToken
        refreshToken.value = data.refreshToken
        
        // Use tokenManager to set tokens in localStorage
        tokenManager.setTokens(data.accessToken, data.refreshToken)
    }

    const clearAuth = () => {
        user.value = null
        const accessToken = useCookie('accessToken')
        const refreshToken = useCookie('refreshToken')
        const businessId = useCookie('businessId')

        accessToken.value = null
        refreshToken.value = null
        businessId.value = null
        
        // Use tokenManager to clear tokens from localStorage
        tokenManager.clearTokens()
    }

    const fetchUser = async () => {
        try {
            const { data } = await auth_api.getProfile()
            user.value = data.user
        } catch (e) {
            clearAuth()
        }
    }

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        fetchUser
    }
}
