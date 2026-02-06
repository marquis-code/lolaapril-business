import type { Service, ServiceCategory, CreateServiceDto, CreateCategoryDto } from '~/types/service'
import { service_api } from '~/api_factory/modules'

export const useService = () => {
    // State
    const services = ref<Service[]>([])
    const categories = ref<ServiceCategory[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Fetch all services
    const fetchServices = async (params?: Record<string, any>) => {
        loading.value = true
        try {
            const { data } = await service_api.getServices(params)
            // Handle both paginated and standard response structures if they differ
            services.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    // Fetch all categories
    const fetchCategories = async (params?: Record<string, any>) => {
        try {
            const { data } = await service_api.getCategories(params)
            categories.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            console.error('Failed to fetch categories', e)
        }
    }

    // Create Service
    const createService = async (payload: CreateServiceDto) => {
        loading.value = true
        try {
            const { data } = await service_api.createService(payload)
            await fetchServices() // Refresh list
            return data
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    // Create Category
    const createCategory = async (payload: CreateCategoryDto) => {
        try {
            const { data } = await service_api.createCategory(payload)
            await fetchCategories()
            return data
        } catch (e: any) {
            throw e
        }
    }

    // Delete Service
    const deleteService = async (id: string) => {
        try {
            await service_api.deleteService(id)
            services.value = services.value.filter(s => s._id !== id)
        } catch (e: any) {
            throw e
        }
    }

    return {
        services,
        categories,
        loading,
        error,
        fetchServices,
        fetchCategories,
        createService,
        createCategory,
        deleteService
    }
}
