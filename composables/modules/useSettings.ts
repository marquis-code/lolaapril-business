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
            const response = await settings_api.getSettings()
            console.log('Fetched settings:', response.data)
            if ([200, 201].includes(response.status)) {
                settings.value = response.data.data || response.data
            }
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const updateSettings = async (payload: Partial<BusinessSettings>) => {
        try {
            const response = await settings_api.updateSettings(payload)
            if ([200, 201].includes(response.status)) {
                const updatedData = response.data.data || response.data
                settings.value = { ...settings.value, ...updatedData }
                return response
            }
        } catch (e: any) {
            throw e
        }
    }

    const createSettings = async (payload: BusinessSettings) => {
        try {
            const response = await settings_api.createSettings(payload)
            if ([200, 201].includes(response.status)) {
                settings.value = response.data.data || response.data
                return response
            }
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
            const response = await settings_api.getBusinessHours()
            console.log('Fetched business hours:', response.data)
            if ([200, 201].includes(response.status)) {
                businessHours.value = response.data.data || response.data
            }
        } catch (e: any) {
            console.error(e)
        }
    }

    const updateBusinessHours = async (payload: BusinessHours[]) => {
        try {
            const response = await settings_api.updateBusinessHours(payload)
            if ([200, 201].includes(response.status)) {
                businessHours.value = response.data.data || response.data
                return response
            }
        } catch (e: any) {
            throw e
        }
    }

    const fetchAppointmentSettings = async () => {
        try {
            const response = await settings_api.getAppointmentSettings()
            console.log('Fetched appointment settings:', response.data)
            if ([200, 201].includes(response.status)) {
                appointmentSettings.value = response.data.data || response.data
            }
        } catch (e: any) {
            console.error(e)
        }
    }

    const updateAppointmentSettings = async (payload: Record<string, any>) => {
        try {
            const response = await settings_api.updateAppointmentSettings(payload)
            console.log('Updated appointment settings:', response.data)
            if ([200, 201].includes(response.status)) {
                appointmentSettings.value = response.data.data || response.data
                return response
            }
        } catch (e: any) {
            throw e
        }
    }

    const fetchPaymentSettings = async () => {
        try {
            const response = await settings_api.getPaymentSettings()
            if ([200, 201].includes(response.status)) {
                paymentSettings.value = response.data.data || response.data
            }
        } catch (e: any) {
            console.error(e)
        }
    }

    const fetchNotificationSettings = async () => {
        try {
            const response = await settings_api.getNotificationSettings()
            if ([200, 201].includes(response.status)) {
                notificationSettings.value = response.data.data || response.data
            }
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
            const response = await settings_api.getNotificationPreferences(user.value._id, businessId.value)
            if ([200, 201].includes(response.status)) {
                preferences.value = response.data.preferences || response.data
            }
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
            const response = await settings_api.getTheme()
            if ([200, 201].includes(response.status)) {
                theme.value = response.data.data || response.data
            }
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
            const response = await settings_api.getDomains()
            if ([200, 201].includes(response.status)) {
                domains.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
            }
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
