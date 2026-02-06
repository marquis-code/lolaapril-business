import { ref } from 'vue'
import { team_api } from '~/api_factory/modules'

export const useUpdateTeamStatus = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string, status: string) => {
        loading.value = true
        error.value = null
        try {
            await team_api.updateTeamStatus(id, status)
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
