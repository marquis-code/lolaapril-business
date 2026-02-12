import { consultations_api } from '@/api_factory/modules'

export const useGetBookings = () => {
    const loading = ref(false)
    const bookings = ref<any[]>([])

    const fetchBookings = async () => {
        loading.value = true
        try {
            const res = await consultations_api.getBookings()
            bookings.value = res.data
            return res.data
        } catch (error: any) {
            console.error('Failed to fetch bookings:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchBookings()
    })

    return { fetchBookings, bookings, loading }
}
