import { ref } from 'vue'
import { audit_api } from '~/api_factory/modules'

export const useFetchAuditsByUser = () => {
    const data = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (userId: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await audit_api.getAuditsByUser(userId)
            data.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
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
