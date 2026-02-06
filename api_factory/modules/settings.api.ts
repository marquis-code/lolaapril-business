import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { NotificationPreferences, BusinessTheme, BusinessSettings, BusinessHours } from '~/types/settings'

export const settings_api = {
    createSettings: (payload: BusinessSettings) => {
        const url = "/settings"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    getSettings: () => {
        const url = "/settings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    updateSettings: (payload: Partial<BusinessSettings>) => {
        const url = "/settings"
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    deleteSettings: () => {
        const url = "/settings"
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    },

    getBusinessHours: () => {
        const url = "/settings/business-hours"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    updateBusinessHours: (businessHours: BusinessHours[]) => {
        const url = "/settings/business-hours"
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, businessHours)
    },

    getAppointmentSettings: () => {
        const url = "/settings/appointment-settings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    updateAppointmentSettings: (payload: Record<string, any>) => {
        const url = "/settings/appointment-settings"
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    getPaymentSettings: () => {
        const url = "/settings/payment-settings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getNotificationSettings: () => {
        const url = "/settings/notification-settings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getNotificationPreferences: (userId: string, businessId: string) => {
        const url = `/notifications/preferences/${userId}/${businessId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    updateNotificationPreferences: (payload: { userId: string, businessId: string, preferences: NotificationPreferences }) => {
        const url = "/notifications/preferences"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    getTheme: () => {
        const url = "/branding/theme"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    updateTheme: (theme: BusinessTheme) => {
        const url = "/branding/theme"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, theme)
    },

    getDomains: () => {
        const url = "/branding/domains"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    requestDomain: (domain: string) => {
        const url = "/branding/domain"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { domain })
    }
}
