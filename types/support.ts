export interface SupportTicket {
    _id: string;
    clientId: string;
    businessId?: string;
    bookingId?: string;
    subject: string;
    description: string;
    priority: string;
    channel: string;
    category: string;
    tags?: string[];
    metadata?: Record<string, any>;
    status?: string;
    assignedTo?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SupportMessage {
    _id?: string;
    ticketId?: string;
    senderId?: string;
    senderType?: string;
    message: string;
    isInternal?: boolean;
    createdAt?: string;
}

export interface SupportStats {
    totalTickets?: number;
    openTickets?: number;
    inProgressTickets?: number;
    resolvedTickets?: number;
    closedTickets?: number;
    byPriority?: Record<string, number>;
    byChannel?: Record<string, number>;
    byCategory?: Record<string, number>;
}

export interface CreateTicketDto {
    clientId: string;
    businessId?: string;
    bookingId?: string;
    subject: string;
    description: string;
    priority: string;
    channel: string;
    category: string;
    tags?: string[];
    metadata?: Record<string, any>;
}
