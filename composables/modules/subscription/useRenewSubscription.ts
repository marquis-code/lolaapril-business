import { ref } from 'vue'
import { subscription_api } from '~/api_factory/modules'

export const useRenewSubscription = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            await subscription_api.renewSubscription(id)
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
