import { ref } from 'vue'
import type { CustomDomain } from '~/types/settings'
import { settings_api } from '~/api_factory/modules'

export const useFetchDomains = () => {
    const businessId = useCookie('businessId')
    const data = ref<CustomDomain[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        if (!businessId.value) return null

        loading.value = true
        error.value = null
        try {
            const response = await settings_api.getDomains(businessId.value)
            data.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
            return data.value
        } catch (e: any) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}
