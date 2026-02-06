import { ref } from 'vue'
import type { NotificationPreferences } from '~/types/settings'
import { settings_api } from '~/api_factory/modules'

export const useUpdateNotificationPreferences = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (userId: string, businessId: string, preferences: NotificationPreferences) => {
        loading.value = true
        error.value = null
        try {
            await settings_api.updateNotificationPreferences({ userId, businessId, preferences })
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
