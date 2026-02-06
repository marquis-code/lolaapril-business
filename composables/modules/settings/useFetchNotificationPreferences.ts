import { ref } from 'vue'
import type { NotificationPreferences } from '~/types/settings'
import { settings_api } from '~/api_factory/modules'

export const useFetchNotificationPreferences = () => {
    const data = ref<NotificationPreferences | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (userId: string, businessId: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await settings_api.getNotificationPreferences(userId, businessId)
            data.value = response.data.preferences || response.data
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
