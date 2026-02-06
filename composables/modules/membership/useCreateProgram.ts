import { ref } from 'vue'
import type { MembershipProgram } from '~/types/growth'
import { membership_api } from '@/api_factory/modules'

export const useCreateProgram = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: Partial<MembershipProgram>) => {
        loading.value = true
        error.value = null
        try {
            const response = await membership_api.createProgram(payload)
            return response.data?.data || response.data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, execute }
}
