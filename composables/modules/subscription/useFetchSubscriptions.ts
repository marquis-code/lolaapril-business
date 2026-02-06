import { ref } from 'vue'
import type { Subscription } from '~/types/growth'
import { subscription_api } from '~/api_factory/modules'

export const useFetchSubscriptions = () => {
    const businessId = useCookie('businessId')
    const data = ref<Subscription[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        if (!businessId.value) return null

        loading.value = true
        error.value = null
        try {
            const response = await subscription_api.getSubscriptions(businessId.value)
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
