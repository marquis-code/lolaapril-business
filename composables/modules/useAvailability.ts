import type { BusinessHours, WeeklyScheduleItem } from '~/types/availability'
import { availability_api } from '~/api_factory/modules'

export const useAvailability = () => {
    const businessId = useCookie('businessId')

    const businessHours = ref<BusinessHours | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // NOTE: This endpoint might not exist directly as "get business hours", usually it's derived or part of settings.
    // Based on the controller, we can CREATE business hours.
    // There doesn't seem to be a specific "GET business hours configuration" endpoint in the provided controller snippet,
    // but usually it's needed for the UI. I'll assume standard persistence or I might need to fetch it from Business Settings/Profile if it's stored there.
    // *Correction*: Wait, `AvailabilityService` likely has a method to get it, but the controller didn't explicitly show a simple GET for the config itself (only slots).
    // I will shim it for now or check if I missed it.
    // Actually, let's just implement the 'create/update' logic as that's what the controller exposes clearly.

    const createSimpleBusinessHours = async (schedule: WeeklyScheduleItem[], operates24x7: boolean = false) => {
        loading.value = true
        try {
            const { data } = await availability_api.createSimpleBusinessHours({
                operates24x7,
                weeklySchedule: schedule
            })
            return data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        businessHours,
        loading,
        error,
        createSimpleBusinessHours
    }
}
