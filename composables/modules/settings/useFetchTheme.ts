import { ref } from 'vue'
import type { BusinessTheme } from '~/types/settings'
import { settings_api } from '~/api_factory/modules'

export const useFetchTheme = () => {
    const data = ref<BusinessTheme | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        console.log('Fetching theme...')
        try {
            const response = await settings_api.getTheme()
            console.log('Fetched theme response:', response)
            data.value = response.data
            return data.value
        } catch (e: any) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        execute()
    })

    return { data, loading, error, execute }
}
