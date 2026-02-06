import type { Booking, UpdateBookingStatusDto } from '~/types/booking'
import { booking_api } from '~/api_factory/modules'

export const useBooking = () => {
    const bookings = ref<Booking[]>([])
    const currentBooking = ref<Booking | null>(null)
    const stats = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchBookings = async (params: { status?: string, page?: number, limit?: number } = {}) => {
        loading.value = true
        try {
            const { data } = await booking_api.getBookings({
                ...params
            })
            bookings.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchTodayBookings = async () => {
        loading.value = true
        try {
            const { data } = await booking_api.getTodayBookings()
            // Logic depends on response structure, assuming it returns list
            bookings.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchUpcomingBookings = async (days: number = 7) => {
        loading.value = true
        try {
            const { data } = await booking_api.getUpcomingBookings(days)
            bookings.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchBookingById = async (id: string) => {
        loading.value = true
        try {
            const { data } = await booking_api.getBookingById(id)
            currentBooking.value = data.data || data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const updateStatus = async (id: string, payload: UpdateBookingStatusDto) => {
        try {
            await booking_api.updateStatus(id, payload)
            // Update local if exists
            const idx = bookings.value.findIndex(b => b._id === id)
            if (idx !== -1) {
                bookings.value[idx].status = payload.status as any
            }
            if (currentBooking.value && currentBooking.value._id === id) {
                currentBooking.value.status = payload.status as any
            }
        } catch (e: any) {
            throw e
        }
    }

    const fetchStats = async () => {
        try {
            const { data } = await booking_api.getStats()
            stats.value = data
        } catch (e: any) {
            console.error(e)
        }
    }

    return {
        bookings,
        currentBooking,
        stats,
        loading,
        error,
        fetchBookings,
        fetchTodayBookings,
        fetchUpcomingBookings,
        fetchBookingById,
        fetchStats,
        updateStatus
    }
}
