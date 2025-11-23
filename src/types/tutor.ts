export interface Tutor {
  id: string
  name: string
  balance: number
  email: string
  role: string
  validatedTeacher: boolean
  phone: string
  location: Location
  subject: string
  price: number
  description: string
  img: string
  reputation: Reputacion
  availabilities: Availabilities[];
}

interface Availabilities{
  id: string;
  tutorId: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  dayOfWeek: string; 
  active: boolean;
}

interface Reputacion{
  rating: number
  rewiewsCount: number
}

interface Location{
  city: string
  country: string
}