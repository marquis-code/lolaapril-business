import type { CreateTicketDto, SupportMessage, SupportTicket } from '~/types/support'
import { support_api } from '~/api_factory/modules'

export const useSupport = () => {
    const tickets = ref<SupportTicket[]>([])
    const currentTicket = ref<SupportTicket | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchTickets = async (params: Record<string, any> = {}) => {
        loading.value = true
        try {
            const { data } = await support_api.getTickets(params)
            tickets.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchTicketById = async (id: string) => {
        loading.value = true
        try {
            const { data } = await support_api.getTicketById(id)
            currentTicket.value = data.data || data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const createTicket = async (payload: CreateTicketDto) => {
        loading.value = true
        try {
            await support_api.createTicket(payload)
            await fetchTickets()
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const updateTicketStatus = async (id: string, status: string, userId: string) => {
        try {
            await support_api.updateTicketStatus(id, { status, userId })
            await fetchTickets()
        } catch (e: any) {
            throw e
        }
    }

    const addComment = async (ticketId: string, messageData: SupportMessage) => {
        try {
            await support_api.addMessage(ticketId, messageData)
        } catch (e: any) {
            throw e
        }
    }

    return {
        tickets,
        currentTicket,
        loading,
        error,
        fetchTickets,
        fetchTicketById,
        createTicket,
        updateTicketStatus,
        addComment
    }
}
