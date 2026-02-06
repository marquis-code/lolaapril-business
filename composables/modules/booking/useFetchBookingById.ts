import { ref } from 'vue'
import type { Booking } from '~/types/booking'
import { booking_api } from '~/api_factory/modules'

export const useFetchBookingById = () => {
    const data = ref<Booking | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await booking_api.getBookingById(id)
            data.value = response.data.data || response.data
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
