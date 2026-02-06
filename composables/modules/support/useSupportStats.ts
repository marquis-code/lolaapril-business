import { ref } from 'vue'
import type { SupportStats } from '~/types/support'
import { support_api } from '~/api_factory/modules'

export const useSupportStats = () => {
    const data = ref<SupportStats | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await support_api.getStats()
            data.value = response.data.data || response.data
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
