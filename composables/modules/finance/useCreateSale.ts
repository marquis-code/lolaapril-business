import { ref } from 'vue'
import type { CreateSaleDto } from '~/types/finance'
import { finance_api } from '~/api_factory/modules'

export const useCreateSale = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CreateSaleDto) => {
        loading.value = true
        error.value = null
        try {
            const response = await finance_api.createSale(payload)
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
