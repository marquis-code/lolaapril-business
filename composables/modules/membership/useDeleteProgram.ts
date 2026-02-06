import { ref } from 'vue'
import { membership_api } from '@/api_factory/modules'

export const useDeleteProgram = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            await membership_api.deleteProgram(id)
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
