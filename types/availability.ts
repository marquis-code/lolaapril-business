export interface TimeSlot {
    startTime: string; // "09:00"
    endTime: string;   // "17:00"
}

export interface WeeklyScheduleItem {
    dayOfWeek: number; // 0=Sunday, 1=Monday...
    isOpen: boolean;
    timeSlots: TimeSlot[];
}

export interface BusinessHours {
    businessId: string;
    operates24x7: boolean;
    weeklySchedule: WeeklyScheduleItem[];
    timezone?: string;
}

export interface Slot {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    staffIds: string[]; // Who is available
}

export interface DaySlots {
    date: string; // YYYY-MM-DD
    slots: Slot[];
}

export interface AvailabilityStats {
    totalDates: number;
    datesWithAvailability: number;
    datesFullyBooked: number;
}
