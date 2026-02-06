import { ref } from 'vue'
import type { CreateTeamMemberDto } from '~/types/team'
import { team_api } from '~/api_factory/modules'

export const useCreateTeamMember = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CreateTeamMemberDto) => {
        loading.value = true
        error.value = null
        try {
            await team_api.createTeamMember(payload)
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
