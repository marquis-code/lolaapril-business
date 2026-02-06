import { ref } from 'vue'
import type { TeamMember } from '~/types/team'
import { team_api } from '~/api_factory/modules'

export const useFetchTeamMemberById = () => {
    const data = ref<TeamMember | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await team_api.getTeamMemberById(id)
            data.value = response.data.data || response.data
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
