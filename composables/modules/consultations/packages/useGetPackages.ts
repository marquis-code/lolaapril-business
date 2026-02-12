import { consultations_api } from '@/api_factory/modules'

export const useGetPackages = () => {
    const loading = ref(false)
    const packages = ref<any[]>([])

    const fetchPackages = async () => {
        loading.value = true
        try {
            const res = await consultations_api.getAllPackages()
            packages.value = res.data
            return res.data
        } catch (error: any) {
            console.error('Failed to fetch packages:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchPackages()
    })

    return { fetchPackages, packages, loading }
}
