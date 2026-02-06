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

export const useAudit = () => {
    const businessId = useCookie('businessId')

    const auditLogs = ref<AuditLog[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchAuditLogs = async (params: {
        page?: number,
        limit?: number,
        entity?: string,
        action?: string,
        startDate?: string,
        endDate?: string
    } = {}) => {
        loading.value = true
        try {
            const { data } = await audit_api.getAuditLogs({
                businessId: businessId.value!,
                ...params
            })
            auditLogs.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchAuditById = async (id: string) => {
        try {
            const { data } = await audit_api.getAuditById(id)
            return data.data || data
        } catch (e: any) {
            throw e
        }
    }

    const fetchAuditsByEntity = async (entityType: string, entityId: string) => {
        try {
            const { data } = await audit_api.getAuditsByEntity(entityType, entityId)
            return Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            throw e
        }
    }

    const fetchAuditsByUser = async (userId: string) => {
        try {
            const { data } = await audit_api.getAuditsByUser(userId)
            return Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            throw e
        }
    }

    return {
        auditLogs,
        loading,
        error,
        fetchAuditLogs,
        fetchAuditById,
        fetchAuditsByEntity,
        fetchAuditsByUser
    }
}
