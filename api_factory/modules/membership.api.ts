import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { MembershipProgram } from '~/types/growth'

export const membership_api = {
    getPrograms: (params?: {
        membershipType?: string
        isActive?: boolean
        search?: string
        page?: number
        limit?: number
    }) => {
        const url = '/memberships'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getProgramById: (id: string) => {
        const url = `/memberships/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    createProgram: (payload: Partial<MembershipProgram>) => {
        const url = '/memberships'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    updateProgram: (id: string, payload: Partial<MembershipProgram>) => {
        const url = `/memberships/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    deleteProgram: (id: string) => {
        const url = `/memberships/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    },

    enrollClient: (payload: {
        clientId: string
        membershipId: string
        membershipNumber: string
        joinDate: string
        expiryDate?: string
        totalPoints?: number
        totalSpent?: number
        currentTier?: string
        tierProgress?: number
        status?: string
    }) => {
        const url = '/memberships/enroll'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    getClientMemberships: (clientId: string) => {
        const url = `/memberships/client/${clientId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getClientBenefits: (clientId: string) => {
        const url = `/memberships/client/${clientId}/benefits`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    addPoints: (membershipId: string, payload: { points: number; description: string; saleId?: string }) => {
        const url = `/memberships/client-membership/${membershipId}/points/add`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    redeemPoints: (membershipId: string, payload: { points: number; description: string }) => {
        const url = `/memberships/client-membership/${membershipId}/points/redeem`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    updateSpending: (membershipId: string, payload: { amount: number }) => {
        const url = `/memberships/client-membership/${membershipId}/spending`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    getStats: () => {
        const url = '/memberships/stats'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    }
}
