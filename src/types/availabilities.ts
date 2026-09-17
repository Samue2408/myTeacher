export interface AvailabilitiesByDateResponse {
    date: string,
    dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY",
    availableSlots: slotType[]
}

export interface slotType {
    startTime: string,
    endTime: string
}