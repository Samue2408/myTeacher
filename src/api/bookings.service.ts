import http from "./http";
import { BaseService } from "./base.service";
import { BookingsType } from "@/types/bookings";

export class BookingsServiceClass extends BaseService {
  constructor() {
    super("/bookings");
  }

  async getByTutor(tutorId: string): Promise<BookingsType[]> {
    try {
      const response = await http.get<BookingsType[]>(
        `${this.basePath}/count/tutor-bookings/${tutorId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al obtener las reservas."
      );
    }
  }

  async createBooking(
    booking: Omit<BookingsType, "id" | "createdAt" | "updatedAt">
  ): Promise<BookingsType> {
    try {
      const response = await http.post<BookingsType>(
        `${this.basePath}/create`,
        booking
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al crear la reserva."
      );
    }
  }
}

export const BookingsService = new BookingsServiceClass();
