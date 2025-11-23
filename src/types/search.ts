export interface SubjectSearchResponse {
    _id: string;
    name: string;
    educationLevel: string;
    price: number;
    tutorId: TutorInfo;
}

export interface TutorInfo {
    name: string;
    balance: number;
    email: string;
    role: string;
    validatedTeacher: boolean;
    phone: string;
    location: TutorLocation;
    reputation: TutorReputation;
    availability: Availabilities[];
    _id: string;
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


export interface TutorLocation {
    city: string;
    country: string;
}

export interface TutorReputation {
    rating: number;
    rewiewsCount: number; 
}
