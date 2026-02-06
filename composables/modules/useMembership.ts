import type { MembershipProgram, ClientMembership } from '~/types/growth'
import { membership_api } from '@/api_factory/modules'

export const useMembership = () => {
    const programs = ref<MembershipProgram[]>([])
    const clientMemberships = ref<ClientMembership[]>([])
    const stats = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchPrograms = async (params?: {
        membershipType?: string
        isActive?: boolean
        search?: string
        page?: number
        limit?: number
    }) => {
        loading.value = true
        try {
            const { data } = await membership_api.getPrograms(params)
            programs.value = Array.isArray(data?.data) ? data.data : (data?.data || data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchProgramById = async (id: string) => {
        try {
            const { data } = await membership_api.getProgramById(id)
            return data.data || data
        } catch (e: any) {
            throw e
        }
    }

    const createProgram = async (payload: Partial<MembershipProgram>) => {
        loading.value = true
        try {
            await membership_api.createProgram(payload)
            await fetchPrograms()
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const updateProgram = async (id: string, payload: Partial<MembershipProgram>) => {
        try {
            await membership_api.updateProgram(id, payload)
            await fetchPrograms()
        } catch (e: any) {
            throw e
        }
    }

    const deleteProgram = async (id: string) => {
        try {
            await membership_api.deleteProgram(id)
            programs.value = programs.value.filter(p => p._id !== id)
        } catch (e: any) {
            throw e
        }
    }

    const enrollClient = async (payload: {
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
        try {
            await membership_api.enrollClient(payload)
        } catch (e: any) {
            throw e
        }
    }

    const fetchClientMemberships = async (clientId: string) => {
        try {
            const { data } = await membership_api.getClientMemberships(clientId)
            clientMemberships.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            throw e
        }
    }

    const getClientBenefits = async (clientId: string) => {
        try {
            const { data } = await membership_api.getClientBenefits(clientId)
            return data.data || data
        } catch (e: any) {
            throw e
        }
    }

    const addPoints = async (membershipId: string, points: number, description: string, saleId?: string) => {
        try {
            await membership_api.addPoints(membershipId, {
                points,
                description,
                saleId
            })
        } catch (e: any) {
            throw e
        }
    }

    const redeemPoints = async (membershipId: string, points: number, description: string) => {
        try {
            await membership_api.redeemPoints(membershipId, {
                points,
                description
            })
        } catch (e: any) {
            throw e
        }
    }

    const fetchStats = async () => {
        try {
            const { data } = await membership_api.getStats()
            stats.value = data?.data || data
        } catch (e: any) {
            console.error(e)
        }
    }

    return {
        programs,
        clientMemberships,
        stats,
        loading,
        error,
        fetchPrograms,
        fetchProgramById,
        createProgram,
        updateProgram,
        deleteProgram,
        enrollClient,
        fetchClientMemberships,
        getClientBenefits,
        addPoints,
        redeemPoints,
        fetchStats
    }
}
