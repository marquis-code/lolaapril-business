import { appointment_api } from '@/api_factory/modules/appointment.api'

export const useMarkAppointmentCompleted = () => {
    const loading = ref(false)

    const markAsCompleted = async (id: string) => {
        loading.value = true
        try {
            const res = await appointment_api.markAsCompleted(id)
            useNuxtApp().$toast.success('Appointment marked as completed.', {
                autoClose: 2000,
            })
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to mark appointment as completed.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { markAsCompleted, loading }
}
