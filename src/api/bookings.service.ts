import http from "./http";
import { BaseService } from "./base.service";
import { BookingsType } from "@/types/bookings";

export class BookingsServiceClass extends BaseService {
    constructor(){
        super('/bookings')
    }

    async getByTutor(tutorId: string): Promise<BookingsType[]> {
        try {
            const response = await http.get<BookingsType[]>(`${this.basePath}/tutor-bookings/${tutorId}`)
            return response.data;
        } catch(error){
            throw new Error(
                error.response?.data?.message || "Error al obtener las reservas."
            )
        }
    }
}

export const BookingsService = new BookingsServiceClass()