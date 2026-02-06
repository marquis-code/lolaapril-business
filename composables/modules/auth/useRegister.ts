import { ref } from 'vue'
import type { BusinessRegisterDto, AuthResponse } from '~/types/auth'
import { useUser } from '@/composables/modules/auth/user'
import { auth_api } from '~/api_factory/modules'

export const useRegister = () => {
    const data = ref<AuthResponse | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const router = useRouter()
    const { createUser } = useUser()

    const register = async (payload: BusinessRegisterDto) => {
        loading.value = true
        error.value = null
        try {
            const response = await auth_api.register(payload)
            createUser(response.data)
            router.push('/auth/login?registered=success')
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
        register
    }
}
