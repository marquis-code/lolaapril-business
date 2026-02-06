import { ref } from 'vue'
import type { User } from '~/types/auth'
import { auth_api } from '~/api_factory/modules'

export const useFetchUser = () => {
    const data = ref<User | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await auth_api.getProfile()
            data.value = response.data.user
            return data.value
        } catch (e: any) {
            error.value = e.message
            // Clear auth on profile fetch failure
            const accessToken = useCookie('accessToken')
            const refreshToken = useCookie('refreshToken')
            accessToken.value = null
            refreshToken.value = null
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        data,
        loading,
        error,
        execute
    }
}
