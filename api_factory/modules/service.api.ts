import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { CreateCategoryDto, CreateServiceBundleDto, CreateServiceDto, ServiceVariant } from '~/types/service'

export const service_api = {
    getServices: (params?: Record<string, any>) => {
        const url = "/services"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getServiceById: (serviceId: string) => {
        const url = `/services/${serviceId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getServiceStats: (params?: Record<string, any>) => {
        const url = "/services/stats"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getCategories: (params?: Record<string, any>) => {
        const url = "/services/categories"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    createService: (payload: CreateServiceDto) => {
        const url = "/services"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    bulkCreateServices: (services: CreateServiceDto[]) => {
        const url = "/services/bulk"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { services })
    },

    updateService: (serviceId: string, payload: Partial<CreateServiceDto>) => {
        const url = `/services/${serviceId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    addServiceVariant: (serviceId: string, payload: ServiceVariant) => {
        const url = `/services/${serviceId}/variants`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    createCategory: (payload: CreateCategoryDto) => {
        const url = "/services/categories"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    bulkCreateCategories: (categories: CreateCategoryDto[]) => {
        const url = "/services/categories/bulk"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { categories })
    },

    updateCategory: (categoryId: string, payload: Partial<CreateCategoryDto>) => {
        const url = `/services/categories/${categoryId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    deleteCategory: (categoryId: string) => {
        const url = `/services/categories/${categoryId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    },

    deleteService: (id: string) => {
        const url = `/services/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    },

    createBundle: (payload: CreateServiceBundleDto) => {
        const url = "/services/bundles"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    getBundles: (params?: Record<string, any>) => {
        const url = "/services/bundles"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getBundleById: (bundleId: string) => {
        const url = `/services/bundles/${bundleId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    updateBundle: (bundleId: string, payload: Partial<CreateServiceBundleDto>) => {
        const url = `/services/bundles/${bundleId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    }
}
