import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const audit_api = {
    getAuditLogs: (params: {
        businessId: string,
        page?: number,
        limit?: number,
        entity?: string,
        action?: string,
        startDate?: string,
        endDate?: string
    }) => {
        const url = "/audits"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getAuditById: (id: string) => {
        const url = `/audits/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getAuditsByEntity: (entityType: string, entityId: string) => {
        const url = `/audits/entity/${entityType}/${entityId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getAuditsByUser: (userId: string) => {
        const url = `/audits/user/${userId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    }
}
