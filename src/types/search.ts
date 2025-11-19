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
}

export interface TutorLocation {
    city: string;
    country: string;
}

export interface TutorReputation {
    rating: number;
    rewiewsCount: number; 
}
