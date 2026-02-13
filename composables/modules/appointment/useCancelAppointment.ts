import { appointment_api } from '@/api_factory/modules/appointment.api'
import { useNuxtApp } from '#app'
import { ref } from 'vue'

export const useCancelAppointment = () => {
    const loading = ref(false)

    const cancelAppointment = async (id: string, reason?: string) => {
        loading.value = true
        try {
            const payload = { status: 'cancelled', cancellationReason: reason || 'Cancelled by business' }
            const res = await appointment_api.updateStatus(id, payload)
            useNuxtApp().$toast.success('Appointment cancelled successfully.', {
                autoClose: 2000,
            })
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to cancel appointment.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { cancelAppointment, loading }
}
