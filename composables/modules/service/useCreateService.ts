import { ref } from 'vue'
import type { CreateServiceDto } from '~/types/service'
import { service_api } from '~/api_factory/modules'

export const useCreateService = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CreateServiceDto) => {
        loading.value = true
        error.value = null
        try {
            const response = await service_api.createService(payload)
            data.value = response.data
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
