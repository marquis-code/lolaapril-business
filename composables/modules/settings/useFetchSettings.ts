import { ref } from 'vue'
import type { BusinessSettings } from '~/types/settings'
import { settings_api } from '~/api_factory/modules'

export const useFetchSettings = () => {
    const data = ref<BusinessSettings | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await settings_api.getSettings()
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
