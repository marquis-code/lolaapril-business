import { consultations_api } from '@/api_factory/modules'

export const useGetAvailability = () => {
    const loading = ref(false)
    const availability = ref<any>(null)

    const fetchAvailability = async () => {
        loading.value = true
        try {
            const res = await consultations_api.getAvailability()
            availability.value = res.data
            return res.data
        } catch (error: any) {
            console.error('Failed to fetch availability:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchAvailability()
    })

    return { fetchAvailability, availability, loading }
}
