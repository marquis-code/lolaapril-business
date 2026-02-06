import { ref } from 'vue'
import { audit_api } from '~/api_factory/modules'

export interface AuditLog {
    _id: string;
    businessId: string;
    userId: string;
    action: string;
    entity: string;
    entityId?: string;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export const useFetchAuditLogs = () => {
    const businessId = useCookie('businessId')
    const data = ref<AuditLog[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params: {
        page?: number,
        limit?: number,
        entity?: string,
        action?: string,
        startDate?: string,
        endDate?: string
    } = {}) => {
        if (!businessId.value) return null

        loading.value = true
        error.value = null
        try {
            const response = await audit_api.getAuditLogs({ businessId: businessId.value, ...params })
            data.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
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
