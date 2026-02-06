import { ref } from 'vue'
import type { TeamStats } from '~/types/team'
import { team_api } from '~/api_factory/modules'

export const useTeamStats = () => {
    const data = ref<TeamStats | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await team_api.getTeamStats()
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
