import type {
    BusinessSettings,
    NotificationPreferences,
    BusinessTheme,
    CustomDomain,
    BusinessHours
} from '~/types/settings'
import { settings_api } from '~/api_factory/modules'
import { useAuth } from '@/composables/modules/useAuth'

export const useSettings = () => {
    const businessId = useCookie('businessId')
    const settings = ref<BusinessSettings | null>(null)
    const preferences = ref<NotificationPreferences | null>(null)
    const theme = ref<BusinessTheme | null>(null)
    const domains = ref<CustomDomain[]>([])
    const businessHours = ref<BusinessHours[]>([])
    const appointmentSettings = ref<Record<string, any> | null>(null)
    const paymentSettings = ref<Record<string, any> | null>(null)
    const notificationSettings = ref<Record<string, any> | null>(null)

    const loading = ref(false)
    const error = ref<string | null>(null)

    // Business Settings
    const fetchSettings = async () => {
        loading.value = true
        try {
            const { data } = await settings_api.getSettings()
            console.log('Fetched settings:', data)
            settings.value =  data
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const updateSettings = async (payload: Partial<BusinessSettings>) => {
        try {
            const { data } = await settings_api.updateSettings(payload)
            settings.value = { ...settings.value, ...data }
            return data
        } catch (e: any) {
            throw e
        }
    }

    const createSettings = async (payload: BusinessSettings) => {
        try {
            const { data } = await settings_api.createSettings(payload)
            settings.value = data
            return data
        } catch (e: any) {
            throw e
        }
    }

    const deleteSettings = async () => {
        try {
            await settings_api.deleteSettings()
            settings.value = null
        } catch (e: any) {
            throw e
        }
    }

    const fetchBusinessHours = async () => {
        try {
            const { data } = await settings_api.getBusinessHours()
            console.log('Fetched business hours:', data)
            businessHours.value = data
        } catch (e: any) {
            console.error(e)
        }
    }

    const updateBusinessHours = async (payload: BusinessHours[]) => {
        try {
            const { data } = await settings_api.updateBusinessHours(payload)
            businessHours.value = data.data || data
            return data
        } catch (e: any) {
            throw e
        }
    }

    const fetchAppointmentSettings = async () => {
        try {
            const { data } = await settings_api.getAppointmentSettings()
            console.log('Fetched appointment settings:', data)
            appointmentSettings.value = data
        } catch (e: any) {
            console.error(e)
        }
    }

    const updateAppointmentSettings = async (payload: Record<string, any>) => {
        try {
            const { data } = await settings_api.updateAppointmentSettings(payload)
            console.log('Updated appointment settings:', data)
            appointmentSettings.value = data
            return data
        } catch (e: any) {
            throw e
        }
    }

    const fetchPaymentSettings = async () => {
        try {
            const { data } = await settings_api.getPaymentSettings()
            paymentSettings.value = data.data || data
        } catch (e: any) {
            console.error(e)
        }
    }

    const fetchNotificationSettings = async () => {
        try {
            const { data } = await settings_api.getNotificationSettings()
            notificationSettings.value = data.data || data
        } catch (e: any) {
            console.error(e)
        }
    }

    // Notifications
    const fetchNotificationPreferences = async () => {
        // Need userId, usually from auth store
        const { user } = useAuth()
        if (!user.value?._id || !businessId.value) return

        try {
            const { data } = await settings_api.getNotificationPreferences(user.value._id, businessId.value)
            preferences.value = data.preferences || data
        } catch (e: any) {
            console.error(e)
        }
    }

    const updateNotificationPreferences = async (newPrefs: NotificationPreferences) => {
        const { user } = useAuth()
        if (!user.value?._id || !businessId.value) return

        try {
            await settings_api.updateNotificationPreferences({
                userId: user.value._id,
                businessId: businessId.value,
                preferences: newPrefs
            })
            preferences.value = newPrefs
        } catch (e: any) {
            throw e
        }
    }

    // Branding / Theme
    const fetchTheme = async () => {
        try {
            const { data } = await settings_api.getTheme()
            theme.value = data
        } catch (e: any) {
            console.error('Theme fetch error', e)
        }
    }

    const updateTheme = async (newTheme: BusinessTheme) => {
        try {
            await settings_api.updateTheme(newTheme) // Controller uses POST for createOrUpdate
            theme.value = newTheme
        } catch (e: any) {
            throw e
        }
    }

    // Domains
    const fetchDomains = async () => {
        try {
            const { data } = await settings_api.getDomains()
            domains.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            console.error(e)
        }
    }

    const requestDomain = async (domain: string) => {
        try {
            await settings_api.requestDomain(domain)
            await fetchDomains()
        } catch (e: any) {
            throw e
        }
    }

    return {
        settings,
        preferences,
        theme,
        domains,
        businessHours,
        appointmentSettings,
        paymentSettings,
        notificationSettings,
        loading,
        error,
        fetchSettings,
        updateSettings,
        createSettings,
        deleteSettings,
        fetchBusinessHours,
        updateBusinessHours,
        fetchAppointmentSettings,
        updateAppointmentSettings,
        fetchPaymentSettings,
        fetchNotificationSettings,
        fetchNotificationPreferences,
        updateNotificationPreferences,
        fetchTheme,
        updateTheme,
        fetchDomains,
        requestDomain
    }
}
