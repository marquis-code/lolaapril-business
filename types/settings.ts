export interface DailySalesSummary {
    date: string;
    totalRevenue: number;
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    newClients: number;
    returningClients: number;
    servicesSummary: Array<{
        serviceId: string;
        serviceName: string;
        quantity: number;
        revenue: number;
    }>;
    staffSummary: Array<{
        staffId: string;
        staffName: string;
        appointmentsCompleted: number;
        revenue: number;
        commission: number;
    }>;
    paymentMethodsSummary: Array<{
        method: string;
        count: number;
        amount: number;
    }>;
    averageTicketSize: number;
    totalTax: number;
    totalDiscount: number;
    totalServiceCharge: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface WeeklySalesReport {
    startDate: string;
    endDate: string;
    totalRevenue: number;
    totalAppointments: number;
    totalTax?: number;
    totalDiscount?: number;
    totalServiceCharge?: number;
    dailyBreakdown: DailySalesSummary[];
}

export interface NotificationPreferences {
    booking_confirmation: { email: boolean; sms: boolean };
    booking_rejection: { email: boolean; sms: boolean };
    appointment_reminder: { email: boolean; sms: boolean };
    appointment_cancelled: { email: boolean; sms: boolean };
    payment_confirmation: { email: boolean; sms: boolean };
    payment_failed: { email: boolean; sms: boolean };
    promotional: { email: boolean; sms: boolean };
}

export interface BusinessPhone {
    countryCode: string;
    number: string;
}

export interface BusinessAddress {
    street: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
}

export interface BusinessHours {
    day: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
}

export interface AppointmentStatus {
    statusName: string;
    statusIcon: string;
    statusColor: string;
    characterLimit?: number;
    isActive?: boolean;
}

export interface CancellationReason {
    name: string;
    reasonType: 'client_initiated' | 'business_initiated' | 'external_factors';
    isActive?: boolean;
}

export interface Resource {
    name: string;
    description: string;
    isActive?: boolean;
}

export interface BlockedTimeType {
    type: string;
    typeIcon: string;
    duration: string;
    compensation: 'Paid' | 'Unpaid';
    isActive?: boolean;
}

export interface PaymentMethod {
    name: string;
    paymentType: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet';
    enabled: boolean;
}

export interface ServiceChargeBasicInfo {
    name: string;
    description: string;
}

export interface ServiceChargeSettings {
    applyServiceChargeOn: string;
    automaticallyApplyDuringCheckout: boolean;
}

export interface Amount {
    currency: string;
    value: number;
}

export interface RateType {
    type: 'Flat rate' | 'Percentage' | 'Both';
    amount?: Amount;
    percentage?: number;
    flatRate?: Amount;
}

export interface TaxRate {
    tax: string;
    rate: number;
}

export interface ServiceCharge {
    basicInfo: ServiceChargeBasicInfo;
    settings: ServiceChargeSettings;
    rateType: RateType;
    taxRate: TaxRate;
    isActive?: boolean;
}

export interface Tax {
    taxName: string;
    taxRate: number;
    isActive?: boolean;
}

export interface ClosedPeriod {
    startDate: string;
    endDate: string;
    description: string;
    businessClosed: boolean;
    onlineBookingBlocked: boolean;
}

export interface BusinessSettings {
    _id?: string;
    businessName: string;
    businessEmail: string;
    businessPhone: BusinessPhone;
    businessAddress: BusinessAddress;
    businessHours: BusinessHours[];
    appointmentStatuses?: AppointmentStatus[];
    cancellationReasons?: CancellationReason[];
    resources?: Resource[];
    blockedTimeTypes?: BlockedTimeType[];
    paymentMethods?: PaymentMethod[];
    serviceCharges?: ServiceCharge[];
    taxes?: Tax[];
    closedPeriods?: ClosedPeriod[];
    defaultCurrency?: string;
    timezone?: string;
    defaultAppointmentDuration?: number;
    bookingWindowHours?: number;
    allowOnlineBooking?: boolean;
    requireClientConfirmation?: boolean;
}

export interface BusinessTheme {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    logoUrl?: string;
    bannerUrl?: string;
}

export interface CustomDomain {
    _id: string;
    domain: string;
    status: 'pending' | 'verified' | 'failed' | 'active';
    dnsRecords?: { type: string; name: string; value: string }[];
    verifiedAt?: string;
}
