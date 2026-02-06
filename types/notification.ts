export interface NotificationLog {
  _id: string
  businessId?: string
  recipientId?: string
  recipientType?: string
  channel?: string
  recipient?: string
  subject?: string
  content?: string
  status?: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
  providerMessageId?: string
  errorMessage?: string
  sentAt?: string
  deliveredAt?: string
  relatedEntityId?: string
  relatedEntityType?: string
  templateId?: string
  createdAt?: string
  updatedAt?: string
  isRead?: boolean
  readAt?: string | null
  type?: string
  title?: string
  message?: string
  actionUrl?: string
}

export interface NotificationTemplate {
  _id: string
  businessId: string
  templateName: string
  templateType: string
  channel: 'email' | 'sms' | 'both'
  subject: string
  content: string
  availableVariables?: Array<{ key: string; description: string; example: string }>
  isActive?: boolean
  isDefault?: boolean
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}
