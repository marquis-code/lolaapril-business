export interface StaffSkill {
    serviceId: string;
    serviceName: string;
    skillLevel: 'beginner' | 'intermediate' | 'expert' | 'master';
    experienceMonths?: number;
    isActive?: boolean;
}

export interface StaffCommission {
    serviceId?: string;
    commissionType: 'percentage' | 'fixed';
    commissionValue: number;
    minimumAmount?: number;
    isActive?: boolean;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    isBreak?: boolean;
    breakType?: string;
}

export interface DailySchedule {
    dayOfWeek: number;
    isWorkingDay?: boolean;
    workingHours: TimeSlot[];
    breaks?: TimeSlot[];
    maxHoursPerDay?: number;
}

export interface StaffSchedule {
    _id?: string;
    staffId: string;
    businessId?: string;
    effectiveDate: string;
    endDate?: string;
    weeklySchedule: DailySchedule[];
    scheduleType?: 'regular' | 'temporary' | 'override' | '24_7';
    reason?: string;
    createdBy?: string;
    isDefault24_7?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AssignmentDetails {
    startTime: string;
    endTime: string;
    assignmentType?: 'primary' | 'secondary' | 'backup';
    estimatedDuration?: number;
    specialInstructions?: string;
    roomNumber?: string;
    requiredEquipment?: string[];
    clientPreferences?: string;
    setupTimeMinutes?: number;
    cleanupTimeMinutes?: number;
    serviceId: string;
    serviceName: string;
}

export interface StaffAssignment {
    _id: string;
    staffId: string;
    businessId?: string;
    appointmentId: string;
    clientId?: string;
    assignmentDate: string;
    assignmentDetails: AssignmentDetails;
    assignedBy?: string;
    assignmentMethod?: 'auto' | 'manual' | 'client_request';
    status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    actualStartTime?: string;
    actualEndTime?: string;
    completionNotes?: string;
    rating?: number;
    clientFeedback?: string;
    staffFeedback?: string;
    qualityCheckNotes?: string;
    qualityCheckCompleted?: boolean;
    qualityCheckedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Staff {
    _id: string;
    businessId: string;
    userId?: string; // Linked user account
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'stylist' | 'barber' | 'therapist' | 'nail_tech' | 'receptionist' | 'manager' | 'owner';
    employmentType?: 'full_time' | 'part_time' | 'contractor' | 'intern';
    hireDate: string;
    status: 'active' | 'inactive' | 'on_leave' | 'terminated';
    profileImage?: string;
    bio?: string;
    certifications?: string[];
    skills?: StaffSkill[];
    commissionStructure?: StaffCommission[];
}

export interface CreateStaffDto {
    businessId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    employmentType?: string;
    hireDate: string;
    skills?: StaffSkill[];
    commissionStructure?: StaffCommission[];
    profileImage?: string;
    bio?: string;
    certifications?: string[];
    password?: string;
}

export interface CreateStaffScheduleDto {
    staffId: string;
    businessId?: string;
    effectiveDate: string;
    endDate?: string;
    weeklySchedule: DailySchedule[];
    scheduleType?: 'regular' | 'temporary' | 'override' | '24_7';
    reason?: string;
    createdBy?: string;
    isDefault24_7?: boolean;
}

export interface AssignStaffDto {
    staffId: string;
    businessId?: string;
    appointmentId: string;
    clientId?: string;
    assignmentDate: string;
    assignmentDetails: AssignmentDetails;
    assignedBy?: string;
    assignmentMethod?: 'auto' | 'manual' | 'client_request';
}

export interface AutoAssignStaffDto {
    businessId: string;
    appointmentId: string;
    clientId: string;
    serviceId: string;
    assignmentDate: string;
    startTime: string;
    endTime: string;
}

export interface CheckInStaffDto {
    staffId: string;
    businessId?: string;
    checkedInBy?: string;
    notes?: string;
}

export interface CompleteAssignmentDto {
    actualStartTime?: string;
    actualEndTime?: string;
    completionNotes?: string;
    rating?: number;
    clientFeedback?: string;
    staffFeedback?: string;
    qualityCheckNotes?: string;
    qualityCheckCompleted?: boolean;
    qualityCheckedBy?: string;
}
