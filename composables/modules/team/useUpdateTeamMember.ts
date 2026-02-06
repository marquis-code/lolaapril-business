import { ref } from 'vue'
import type { UpdateTeamMemberDto } from '~/types/team'
import { team_api } from '~/api_factory/modules'

export const useUpdateTeamMember = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string, payload: UpdateTeamMemberDto) => {
        loading.value = true
        error.value = null
        try {
            await team_api.updateTeamMember(id, payload)
            return true
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, execute }
}
