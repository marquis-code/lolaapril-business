export interface ServiceCategory {
    _id: string;
    categoryName: string;
    appointmentColor: string;
    description?: string;
}

export interface TimeValue {
    value: number;
    unit: 'min' | 'h';
}

export interface Price {
    currency: string;
    amount: number;
    minimumAmount?: number;
}

export interface ServiceDuration {
    servicingTime: TimeValue;
    processingTime: TimeValue;
    totalDuration: string;
}

export interface BasicDetails {
    serviceName: string;
    serviceType: string;
    category: ServiceCategory; // ID
    description: string;
}

export interface TeamMember {
    id: string;
    name?: string;
    role?: string;
    selected: boolean;
}

export interface TeamMembers {
    allTeamMembers: boolean;
    selectedMembers: TeamMember[];
}

export interface PricingAndDuration {
    priceType: 'Fixed' | 'Free' | 'From';
    price: Price;
    duration: ServiceDuration;
    extraTimeOptions?: {
        processingTime?: string;
        blockedTime?: string;
        extraServicingTime?: string;
    };
}

export interface OnlineBooking {
    enabled: boolean;
    availableFor: string;
}

export interface ServiceSettings {
    onlineBooking: OnlineBooking;
    forms?: string[];
    commissions?: string[];
    generalSettings?: Record<string, any>;
}

export interface ServiceVariant {
    variantName: string;
    variantDescription: string;
    pricing: {
        priceType: 'Fixed' | 'Free' | 'From';
        price: Price;
        duration: TimeValue;
    };
    settings?: {
        sku?: string;
    };
}

export interface ServiceResources {
    isRequired: boolean;
    resourceList: string[];
}

export interface Service {
    _id: string;
    basicDetails: BasicDetails;
    teamMembers: TeamMembers;
    resources?: ServiceResources;
    pricingAndDuration: PricingAndDuration;
    serviceAddOns?: string[];
    settings?: ServiceSettings;
    variants?: ServiceVariant[];
    isActive: boolean;
}

export interface CreateServiceDto {
    basicDetails: BasicDetails;
    teamMembers: TeamMembers;
    resources?: ServiceResources;
    pricingAndDuration: PricingAndDuration;
    serviceAddOns?: string[];
    settings?: ServiceSettings;
    variants?: ServiceVariant[];
}

export interface CreateCategoryDto {
    categoryName: string;
    appointmentColor: string;
    description?: string;
}

export interface ServiceBundle {
    _id: string;
    basicInfo: {
        bundleName: string;
        category: string;
        description: string;
    };
    services: Array<{
        serviceId: string;
        serviceName: string;
        duration: number;
        sequence: number;
    }>;
    scheduleType: string;
    pricing: {
        priceType: string;
        retailPrice: {
            currency: string;
            amount: number;
        };
    };
    onlineBooking?: {
        enabled: boolean;
        availableFor: string;
    };
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateServiceBundleDto {
    basicInfo: {
        bundleName: string;
        category: string;
        description: string;
    };
    services: Array<{
        serviceId: string;
        serviceName: string;
        duration: number;
        sequence: number;
    }>;
    scheduleType: string;
    pricing: {
        priceType: string;
        retailPrice: {
            currency: string;
            amount: number;
        };
    };
    onlineBooking?: {
        enabled: boolean;
        availableFor: string;
    };
}
