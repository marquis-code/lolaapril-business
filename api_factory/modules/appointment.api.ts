import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config'

export const appointment_api = {
  create: (payload: any) => {
    const url = '/appointments'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },

  findAll: (params?: Record<string, any>) => {
    const url = '/appointments'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },

  getStats: () => {
    const url = '/appointments/stats'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },

  getAvailableSlots: (date: string, staffId?: string) => {
    const url = `/appointments/available-slots/${date}`
    const params = staffId ? { staffId } : undefined
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },

  getByDate: (date: string) => {
    const url = `/appointments/by-date/${date}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },

  getByStaff: (staffId: string, date?: string) => {
    const url = `/appointments/by-staff/${staffId}`
    const params = date ? { date } : undefined
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },

  findOne: (id: string) => {
    const url = `/appointments/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },

  update: (id: string, payload: any) => {
    const url = `/appointments/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },

  updateStatus: (id: string, payload: { status: string; cancellationReason?: string }) => {
    const url = `/appointments/${id}/status`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },

  assignStaff: (id: string, payload: { staffId: string }) => {
    const url = `/appointments/${id}/assign-staff`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },

  remove: (id: string) => {
    const url = `/appointments/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
  },

  markAsCompleted: (id: string) => {
    const url = `/appointments/${id}/complete`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, {})
  }
}
