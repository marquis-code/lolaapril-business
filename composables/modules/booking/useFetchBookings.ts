import { ref } from 'vue'
import type { Booking } from '~/types/booking'
import { booking_api } from '~/api_factory/modules'

export const useFetchBookings = () => {
    const data = ref<Booking[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params: { status?: string, page?: number, limit?: number } = {}) => {
        loading.value = true
        error.value = null
        try {
            const response = await booking_api.getBookings(params)
            console.log('API Response:', response)
            data.value = response.data.bookings as Booking[]
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
