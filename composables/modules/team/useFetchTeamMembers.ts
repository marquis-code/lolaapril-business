import { ref } from 'vue'
import type { TeamMember, TeamMemberQuery } from '~/types/team'
import { team_api } from '~/api_factory/modules'

export const useFetchTeamMembers = () => {
    const data = ref<TeamMember[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params: TeamMemberQuery = {}) => {
        loading.value = true
        error.value = null
        try {
            const response = await team_api.getTeamMembers(params)
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
