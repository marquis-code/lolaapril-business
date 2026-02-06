import { ref } from 'vue'
import type { Service } from '~/types/service'
import { service_api } from '~/api_factory/modules'

export const useFetchServices = () => {
    const data = ref<Service[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params?: Record<string, any>) => {
        loading.value = true
        error.value = null
        try {
            const response = await service_api.getServices(params)
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
