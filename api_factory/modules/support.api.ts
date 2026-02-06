import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { CreateTicketDto } from '~/types/support'

export const support_api = {
    getTickets: (params?: Record<string, any>) => {
        const url = "/support/tickets"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getTicketById: (id: string) => {
        const url = `/support/tickets/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    createTicket: (payload: CreateTicketDto) => {
        const url = "/support/tickets"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    updateTicketStatus: (id: string, payload: { status: string; userId: string }) => {
        const url = `/support/tickets/${id}/status`
        return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
    },

    assignTicket: (id: string, agentId: string) => {
        const url = `/support/tickets/${id}/assign`
        return GATEWAY_ENDPOINT_WITH_AUTH.put(url, { agentId })
    },

    addMessage: (ticketId: string, messageData: Record<string, any>) => {
        const url = `/support/tickets/${ticketId}/messages`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, messageData)
    },

    getMessages: (ticketId: string, params?: { includeInternal?: boolean }) => {
        const url = `/support/tickets/${ticketId}/messages`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getStats: () => {
        const url = "/support/stats"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    makeCall: (ticketId: string, payload: { phoneNumber: string; agentId: string }) => {
        const url = `/support/tickets/${ticketId}/call`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    sendSms: (ticketId: string, payload: { phoneNumber: string; message: string }) => {
        const url = `/support/tickets/${ticketId}/sms`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    }
}
