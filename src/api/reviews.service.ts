import http from "./http";
import type { CreateReviewPayload, Review, UpdateReviewPayload } from "@/types/reviews";

class ReviewsServiceClass {
  private readonly basePath = "/reviews";

  async getByBooking(bookingId: string): Promise<Review[]> {
    const { data } = await http.get<Review[]>(`${this.basePath}/booking/${bookingId}`);
    return Array.isArray(data) ? data : [];
  }

  async create(payload: CreateReviewPayload): Promise<Review> {
    const { data } = await http.post<Review>(`${this.basePath}/create`, payload);
    return data;
  }

  async update(id: string, payload: UpdateReviewPayload): Promise<Review> {
    const { data } = await http.put<Review>(`${this.basePath}/update/${id}`, payload);
    return data;
  }

  async delete(id: string): Promise<void> {
    await http.delete(`${this.basePath}/delete/${id}`);
  }
}

export const ReviewsService = new ReviewsServiceClass();
