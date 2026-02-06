import { ref } from 'vue'
import type { ServiceCategory } from '~/types/service'
import { service_api } from '~/api_factory/modules'

export const useFetchCategories = () => {
    const data = ref<ServiceCategory[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params?: Record<string, any>) => {
        loading.value = true
        error.value = null
        try {
            const response = await service_api.getCategories(params)
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
