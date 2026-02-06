import { ref } from 'vue'
import type { MembershipProgram } from '~/types/growth'
import { membership_api } from '@/api_factory/modules'

export const useFetchMembershipPrograms = () => {
    const data = ref<MembershipProgram[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params?: {
        membershipType?: string
        isActive?: boolean
        search?: string
        page?: number
        limit?: number
    }) => {
        loading.value = true
        error.value = null
        try {
            const response = await membership_api.getPrograms(params)
            data.value = Array.isArray(response.data?.data)
                ? response.data.data
                : (response.data?.data || response.data || [])
            return data.value
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}
