export interface ServiceBookingItem {
    _id?: string;
    serviceId: string | {
        _id: string;
        basicDetails?: {
            serviceName: string;
            serviceType: string;
            category: string;
            description: string;
        };
        pricingAndDuration?: {
            priceType: string;
            price: {
                currency: string;
                amount: number;
            };
            duration: {
                servicingTime: { value: number; unit: string };
                processingTime: { value: number; unit: string };
                totalDuration: string;
            };
        };
    };
    serviceName?: string;
    price?: number;
    duration?: number;
    bufferTime?: number;
}

export interface BookingSource {
    _id?: string;
    sourceType: string;
    sourceIdentifier?: string;
    trackingCode?: string;
    referralCode?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    ipAddress?: string;
    userAgent?: string;
    referrerUrl?: string;
    trackedAt?: string;
}

export interface BookingMetadata {
    _id?: string;
    platform?: string;
}

export interface Booking {
    _id: string;
    businessId: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    services: ServiceBookingItem[];
    preferredDate: string;
    preferredStartTime: string;
    estimatedEndTime?: string;
    totalDuration?: number;
    estimatedTotal?: number;
    totalAmount?: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'postponed' | 'completed' | 'no_show' | 'payment_failed' | 'expired';
    currency?: string;
    paymentStatus?: 'pending' | 'paid' | 'partial' | 'refunded';
    specialRequests?: string;
    bookingNumber?: string;
    bookingSource?: BookingSource;
    metadata?: BookingMetadata;
    requiresDeposit?: boolean;
    depositAmount?: number;
    depositPaid?: boolean;
    remainingAmount?: number;
    firstTimeClient?: boolean;
    totalBufferTime?: number;
    remindersSent?: number;
    lastReminderAt?: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateBookingDto {
    businessId: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    services: ServiceBookingItem[];
    preferredDate: string;
    preferredStartTime: string;
    specialRequests?: string;
    bookingSource: BookingSource;
}

export interface UpdateBookingStatusDto {
    status: string;
    reason?: string;
}
