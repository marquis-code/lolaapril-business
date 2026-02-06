import { ref } from 'vue'
import type { UpdateBookingStatusDto } from '~/types/booking'
import { booking_api } from '~/api_factory/modules'

export const useUpdateBookingStatus = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string, payload: UpdateBookingStatusDto) => {
        loading.value = true
        error.value = null
        try {
            await booking_api.updateStatus(id, payload)
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
