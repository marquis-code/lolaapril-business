import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { CreateTeamMemberDto, TeamMemberQuery, UpdateTeamMemberDto } from '~/types/team'

export const team_api = {
    getTeamMembers: (params?: TeamMemberQuery) => {
        const url = '/team'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getTeamMemberById: (id: string) => {
        const url = `/team/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getTeamStats: () => {
        const url = '/team/stats'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getByRole: (role: string) => {
        const url = `/team/role/${role}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getByDepartment: (department: string) => {
        const url = `/team/department/${department}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    createTeamMember: (payload: CreateTeamMemberDto) => {
        const url = '/team'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    updateTeamMember: (id: string, payload: UpdateTeamMemberDto) => {
        const url = `/team/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    updateTeamStatus: (id: string, status: string) => {
        const url = `/team/${id}/status`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, { status })
    },

    deleteTeamMember: (id: string) => {
        const url = `/team/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    }
}
