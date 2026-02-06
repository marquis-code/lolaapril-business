import type { Subscription } from '~/types/growth'
import { subscription_api } from '~/api_factory/modules'

export const useSubscription = () => {
    const businessId = useCookie('businessId')

    const subscriptions = ref<Subscription[]>([])
    const currentSubscription = ref<Subscription | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchSubscriptions = async () => {
        loading.value = true
        try {
            const { data } = await subscription_api.getSubscriptions(businessId.value!)
            subscriptions.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchActiveSubscription = async () => {
        try {
            const { data } = await subscription_api.getActiveSubscription(businessId.value!)
            currentSubscription.value = data.data || data
        } catch (e: any) {
            error.value = e.message
        }
    }

    const createSubscription = async (planType: string, billingCycle: string) => {
        loading.value = true
        try {
            await subscription_api.createSubscription({
                businessId: businessId.value!,
                planType,
                billingCycle
            })
            await fetchSubscriptions()
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const cancelSubscription = async (id: string, reason?: string) => {
        try {
            await subscription_api.cancelSubscription(id, reason)
            await fetchSubscriptions()
        } catch (e: any) {
            throw e
        }
    }

    const renewSubscription = async (id: string) => {
        try {
            await subscription_api.renewSubscription(id)
            await fetchSubscriptions()
        } catch (e: any) {
            throw e
        }
    }

    return {
        subscriptions,
        currentSubscription,
        loading,
        error,
        fetchSubscriptions,
        fetchActiveSubscription,
        createSubscription,
        cancelSubscription,
        renewSubscription
    }
}
