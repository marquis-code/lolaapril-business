import { booking_api } from "@/api_factory/modules/booking"
import { useLoader } from "@/composables/core/useLoader"

export const useGetMyBookings = () => {
    const error = ref<string | null>(null)
    const { startLoading, stopLoading } = useLoader()
    const bookings = ref<any[]>([]) // Array of date objects with availability info

    const getMyBookings = async () => {
         startLoading('Fetching your bookings...')
        try {
            const res = (await booking_api.getMyBookings()) as any
            console.log("My Bookings Response:", res)
            if (res.status === 200) {
                const result = res.data.data
                bookings.value = result
            }
        } finally {
            stopLoading()
        }
    }

    onMounted(() => {getMyBookings()})

    return { error, bookings,  getMyBookings }
}