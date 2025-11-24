import http from "./http";
import { BaseService } from "./base.service";

export class AvailabilityServiceClass extends BaseService {
    constructor(){
        super('/availabilities')
    }
    
    async getByTutorId(tutorId: string): Promise<any[]> {
        try {
            const response = await http.get<any[]>(`${this.basePath}/availabilityTutor/${tutorId}`)
            return response.data;
        }catch(error){
            throw new Error(
                error.response?.data?.message || "error al obtener las disponibilidades"
            )
        }
    }
}

export const AvailabilityService = new AvailabilityServiceClass()