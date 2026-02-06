export interface ClientProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: {
        countryCode: string;
        number: string;
    };
    birthday?: {
        dayAndMonth: string;
        year: string;
    };
    gender?: string;
    pronouns?: string;
    additionalEmail?: string;
    additionalPhone?: {
        countryCode: string;
        number: string;
    };
}

export interface ClientAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
}

export interface EmergencyContact {
    fullName: string;
    relationship: string;
    phone: {
        countryCode: string;
        number: string;
    };
    email?: string;
}

export interface Client {
    _id: string;
    businessId: string;
    profile: ClientProfile;
    address?: ClientAddress;
    additionalInfo?: {
        clientSource?: string;
        referredBy?: {
            clientId: string;
            clientName: string;
        };
        preferredLanguage?: string;
        occupation?: string;
        country?: string;
    };
    emergencyContacts?: {
        primary?: EmergencyContact;
        secondary?: EmergencyContact;
    };
    settings?: {
        appointmentNotifications?: {
            emailNotifications?: boolean;
        };
        marketingNotifications?: {
            clientAcceptsEmailMarketing?: boolean;
        };
        grokCodeFast1Enabled?: boolean;
    };
    ltv: number;
    totalBookings: number;
    status: 'active' | 'inactive' | 'lead';
    createdAt: string;
}

export interface CreateClientDto {
    profile: ClientProfile;
    address?: ClientAddress;
    additionalInfo?: any;
    emergencyContacts?: any;
    settings?: any;
}
