import { ref } from 'vue'
import type { BusinessTheme } from '~/types/settings'
import { settings_api } from '~/api_factory/modules'

export const useUpdateTheme = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (theme: BusinessTheme) => {
        loading.value = true
        error.value = null
        try {
            await settings_api.updateTheme(theme)
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
