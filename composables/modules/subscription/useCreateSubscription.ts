import { ref } from 'vue'
import { subscription_api } from '~/api_factory/modules'

export const useCreateSubscription = () => {
    const businessId = useCookie('businessId')
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (planType: string, billingCycle: string) => {
        if (!businessId.value) return null

        loading.value = true
        error.value = null
        try {
            await subscription_api.createSubscription({
                businessId: businessId.value,
                planType,
                billingCycle
            })
            return true
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, execute }
}
