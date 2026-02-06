import { ref } from 'vue'
import type { BusinessLoginDto, AuthResponse } from '~/types/auth'
import { useUser } from '@/composables/modules/auth/user'
import { auth_api } from '~/api_factory/modules'

export const useLogin = () => {
    const router = useRouter()
    const data = ref<AuthResponse | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { createUser } = useUser()

    const login = async (credentials: BusinessLoginDto) => {
        loading.value = true
        error.value = null
        try {
            const response = await auth_api.login(credentials)
          createUser(response.data)
        router.push('/dashboard')
            return response.data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        data,
        loading,
        error,
        login
    }
}
