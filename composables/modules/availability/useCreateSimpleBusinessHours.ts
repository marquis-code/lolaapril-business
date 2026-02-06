import { ref } from 'vue'
import type { WeeklyScheduleItem } from '~/types/availability'
import { availability_api } from '~/api_factory/modules'

export const useCreateSimpleBusinessHours = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (schedule: WeeklyScheduleItem[], operates24x7: boolean = false) => {
        loading.value = true
        error.value = null
        try {
            const response = await availability_api.createSimpleBusinessHours({
                operates24x7,
                weeklySchedule: schedule
            })
            data.value = response.data
            return data.value
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        data,
        loading,
        error,
        execute
    }
}
