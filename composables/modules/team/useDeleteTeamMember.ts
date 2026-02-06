import { ref } from 'vue'
import { team_api } from '~/api_factory/modules'

export const useDeleteTeamMember = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            await team_api.deleteTeamMember(id)
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
