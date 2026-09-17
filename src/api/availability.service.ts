import http from "./http";
import { BaseService } from "./base.service";
import { AvailabilitiesByDateResponse } from "@/types/availabilities";

export class AvailabilityServiceClass extends BaseService {
    constructor(){
        super('/availabilities')
    }
    
    async getByTutorId(tutorId: string): Promise<any[]> {
        try {
            const response = await http.get<any[]>(`${this.basePath}/availabilityTutor/${tutorId}`)
            return response.data;
        }catch(error: any){
            throw new Error(
                error.response?.data?.message || "error al obtener las disponibilidades"
            )
        }
    }

    async getAvailabilitiesByDate(tutorId: string, date: string): Promise<AvailabilitiesByDateResponse> {
        try {
            const response = await http.get<AvailabilitiesByDateResponse>(`${this.basePath}/tutors/${tutorId}/availability?date=${date}`)
            return response.data;
        }catch(error: any){
            throw new Error(
                error.response?.data?.message || "error al obtener las disponibilidades de la fecha para el tutor"
            )
        }
    }
}

export const AvailabilityService = new AvailabilityServiceClass()