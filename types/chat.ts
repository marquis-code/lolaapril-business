export interface ChatRoom {
  _id: string
  businessId?: string
  roomType: 'customer-support' | 'team-chat' | 'staff-chat' | 'admin-support'
  roomName: string
  isActive: boolean
  isArchived?: boolean
  lastMessageId?: string
  lastMessageAt?: string
  unreadCount?: number
  metadata?: {
    userType?: string
    userId?: string
    userName?: string
    userEmail?: string
    userPhone?: string
    assignedStaffId?: string
    assignedStaffName?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    tags?: string[]
    customerLocation?: string
    lastSeen?: string
    isGuest?: boolean
    guestInfo?: {
      guestId?: string
      sessionId?: string
      userName?: string
      email?: string
    }
    // Team chat specific
    ownerId?: string
    memberId?: string
    // Admin support specific
    superAdminId?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface ChatMessage {
  _id?: string
  id?: string
  roomId: string
  businessId?: string
  senderId?: string
  senderType: 'customer' | 'staff' | 'bot' | 'system'
  senderName?: string
  messageType: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system' | 'faq-response'
  content: string
  attachments?: string[]
  isRead?: boolean
  readAt?: string
  isAutomated?: boolean
  isFAQ?: boolean
  faqId?: string
  replyToMessageId?: string
  isEdited?: boolean
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
  metadata?: {
    deliveryStatus?: 'sent' | 'delivered' | 'read' | 'failed'
    language?: string
    sentiment?: 'positive' | 'negative' | 'neutral'
    priority?: 'low' | 'medium' | 'high'
    tags?: string[]
    guestId?: string
  }
}

export interface ChatFAQ {
  _id: string
  businessId: string
  question: string
  answer: string
  keywords: string[]
  alternativeQuestions?: string[]
  category?: string
  usageCount?: number
  isActive?: boolean
  confidenceThreshold?: number
  priority?: number
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface AutoResponse {
  _id: string
  businessId: string
  name: string
  responseType: string
  message: string
  trigger?: Record<string, any>
  quickReplies?: string[]
  isActive?: boolean
  includeBusinessHours?: boolean
  includeEstimatedWaitTime?: boolean
  usageCount?: number
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}
