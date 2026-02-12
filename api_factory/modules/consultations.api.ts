import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const consultations_api = {
    // Package Management
    createPackage: (payload: { name: string; description: string; price: number; duration: number }) => {
        const url = '/consultations/packages'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    updatePackage: (id: string, payload: { name?: string; description?: string; price?: number; duration?: number; isActive?: boolean }) => {
        const url = `/consultations/packages/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    getAllPackages: () => {
        const url = '/consultations/packages/all'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    // Availability Management
    updateWeeklySchedule: (payload: { weeklySchedule: any[] }) => {
        const url = '/consultations/availability'
        return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
    },

    getAvailability: () => {
        const url = '/consultations/availability'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    // Booking Management
    getBookings: () => {
        const url = '/consultations/bookings'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    confirmBooking: (id: string) => {
        const url = `/consultations/bookings/${id}/confirm`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    },

    markAsCompleted: (id: string) => {
        const url = `/consultations/bookings/${id}/complete`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    }
}
