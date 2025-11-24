export interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  balance?: number
  location?: Object
  reputation?: Object
  validatedTeacher?: boolean
}

export interface Availabilitytype {
  active: boolean
  dayOfWeek?: string
  date?: string
  endTime: string
  isRecurring: boolean
  startTime: string
  tutorId: string
  _id: string
}