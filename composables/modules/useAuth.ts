import type { BusinessLoginDto, BusinessRegisterDto, AuthResponse, User } from '~/types/auth'
import { auth_api } from '~/api_factory/modules'
import { useTokenManager } from '@/composables/core/useTokenManager'
import type { Business, BusinessSummary } from '~/types/user'

export const useAuth = () => {
    const user = useState<User | null>('user', () => null)
    const business = useState<Business | null>('business', () => null)
    const businesses = useState<BusinessSummary[]>('businesses', () => [])
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

    // Switch Business
    const switchBusiness = async (businessId: string) => {
        try {
            const { data } = await auth_api.switchBusiness(businessId)
            
            // Update tokens
            if (data.accessToken && data.refreshToken) {
                tokenManager.setTokens(data.accessToken, data.refreshToken)
                
                const accessToken = useCookie('accessToken')
                const refreshToken = useCookie('refreshToken')
                accessToken.value = data.accessToken
                refreshToken.value = data.refreshToken
            }
            
            // Update business context
            if (data.business) {
                business.value = data.business
                
                const businessIdCookie = useCookie('businessId')
                businessIdCookie.value = data.business.id
            }
            
            return data
        } catch (error) {
            throw error
        }
    }

    // Add Business
    const addBusiness = async (payload: any) => {
        try {
            const { data } = await auth_api.addBusiness(payload)
            
            // Update tokens
            if (data.accessToken && data.refreshToken) {
                tokenManager.setTokens(data.accessToken, data.refreshToken)
                
                const accessToken = useCookie('accessToken')
                const refreshToken = useCookie('refreshToken')
                accessToken.value = data.accessToken
                refreshToken.value = data.refreshToken
            }
            
            // Update business context
            if (data.business) {
                business.value = data.business
                
                // Add to businesses list
                if (!businesses.value.some(b => b.id === data.business.id)) {
                    businesses.value = [...businesses.value, {
                        id: data.business.id,
                        businessName: data.business.businessName,
                        subdomain: data.business.subdomain,
                        status: data.business.status
                    }]
                }
                
                const businessIdCookie = useCookie('businessId')
                businessIdCookie.value = data.business.id
            }
            
            return data
        } catch (error) {
            throw error
        }
    }

    // Get User Businesses
    const getUserBusinesses = async () => {
        try {
            const { data } = await auth_api.getUserBusinesses()
            const result = data?.data || data
            
            if (result.businesses) {
                businesses.value = result.businesses
            }
            
            return result
        } catch (error) {
            throw error
        }
    }

    // Clear Business Context
    const clearBusinessContext = async () => {
        try {
            const { data } = await auth_api.clearBusinessContext()
            
            // Update tokens
            if (data.accessToken && data.refreshToken) {
                tokenManager.setTokens(data.accessToken, data.refreshToken)
                
                const accessToken = useCookie('accessToken')
                const refreshToken = useCookie('refreshToken')
                accessToken.value = data.accessToken
                refreshToken.value = data.refreshToken
            }
            
            // Clear business context
            business.value = null
            const businessIdCookie = useCookie('businessId')
            businessIdCookie.value = null
            
            return data
        } catch (error) {
            throw error
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
        
        // Set business context if available
        if (data.business) {
            business.value = data.business
            const businessIdCookie = useCookie('businessId')
            businessIdCookie.value = data.business.id
        }
        
        // Set businesses list if available
        if (data.businesses) {
            businesses.value = data.businesses
        }
    }

    const clearAuth = () => {
        user.value = null
        business.value = null
        businesses.value = []
        
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
            
            // Also fetch businesses
            await getUserBusinesses()
        } catch (e) {
            clearAuth()
        }
    }

    return {
        user,
        business,
        businesses,
        isAuthenticated,
        login,
        register,
        logout,
        fetchUser,
        switchBusiness,
        addBusiness,
        getUserBusinesses,
        clearBusinessContext
    }
}
