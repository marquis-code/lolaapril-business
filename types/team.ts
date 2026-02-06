export interface Phone {
    countryCode: string;
    number: string;
}

export interface WorkingHours {
    day: string;
    startTime: string;
    endTime: string;
    isWorking: boolean;
}

export interface Skills {
    services?: string[];
    specializations?: string[];
    experienceLevel?: string;
}

export interface Commission {
    serviceId: string;
    serviceName: string;
    commissionType: 'percentage' | 'fixed';
    commissionValue: number;
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
}

export interface TeamMember {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: Phone;
    role: 'admin' | 'manager' | 'stylist' | 'therapist' | 'receptionist' | 'cleaner';
    employmentType: 'full_time' | 'part_time' | 'contract' | 'freelance';
    hireDate?: string;
    salary?: number;
    workingHours?: WorkingHours[];
    skills?: Skills;
    commissions?: Commission[];
    profileImage?: string;
    bio?: string;
    isActive?: boolean;
    canBookOnline?: boolean;
    emergencyContact?: EmergencyContact;
    department?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTeamMemberDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: Phone;
    role: TeamMember['role'];
    employmentType: TeamMember['employmentType'];
    department?: string;
    hireDate?: string;
    salary?: number;
    workingHours?: WorkingHours[];
    skills?: Skills;
    commissions?: Commission[];
    profileImage?: string;
    bio?: string;
    isActive?: boolean;
    canBookOnline?: boolean;
    emergencyContact?: EmergencyContact;
}

export interface UpdateTeamMemberDto extends Partial<CreateTeamMemberDto> {}

export interface TeamMemberQuery {
    page?: number;
    limit?: number;
    search?: string;
    role?: TeamMember['role'];
    status?: string;
    department?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface TeamStats {
    total?: number;
    active?: number;
    inactive?: number;
    byRole?: Record<string, number>;
    byDepartment?: Record<string, number>;
}
