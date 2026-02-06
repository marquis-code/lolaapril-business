import { ref } from 'vue'
import type { BusinessSettings } from '~/types/settings'
import { settings_api } from '~/api_factory/modules'

export const useUpdateSettings = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: Partial<BusinessSettings>) => {
        loading.value = true
        error.value = null
        try {
            const response = await settings_api.updateSettings(payload)
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
