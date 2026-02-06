import { ref } from 'vue'
import { settings_api } from '~/api_factory/modules'

export const useRequestDomain = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (domain: string) => {
        loading.value = true
        error.value = null
        try {
            await settings_api.requestDomain(domain)
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
