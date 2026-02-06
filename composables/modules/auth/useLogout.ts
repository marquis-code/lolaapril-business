import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'

export const useLogout = () => {
    const router = useRouter()
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        try {
            await auth_api.logout()
        } catch (e: any) {
            // Ignore API errors on logout
            console.error('Logout API error:', e)
        } finally {
            // Clear cookies regardless of API response
            const accessToken = useCookie('accessToken')
            const refreshToken = useCookie('refreshToken')
            const businessId = useCookie('businessId')

            accessToken.value = null
            refreshToken.value = null
            businessId.value = null

            loading.value = false
            router.push('/auth/login')
        }
    }

    return {
        loading,
        error,
        execute
    }
}
