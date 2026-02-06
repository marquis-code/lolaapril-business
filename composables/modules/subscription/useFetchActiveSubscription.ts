import { ref } from 'vue'
import type { Subscription } from '~/types/growth'
import { subscription_api } from '~/api_factory/modules'

export const useFetchActiveSubscription = () => {
    const businessId = useCookie('businessId')
    const data = ref<Subscription | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        if (!businessId.value) return null

        loading.value = true
        error.value = null
        try {
            const response = await subscription_api.getActiveSubscription(businessId.value)
            data.value = response.data.data || response.data
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
