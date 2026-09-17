import { defineStore } from "pinia";
import { ReviewsService } from "@/api/reviews.service";
import { useErrorHandler, useSuccessHandler } from "@/composables/useAlertsHandler";
import type { CreateReviewPayload, Review, UpdateReviewPayload } from "@/types/reviews";

export const useReviewsStore = defineStore("reviews", {
  state: () => ({
    currentReview: null as Review | null,
    currentBookingId: null as string | null,
    isLoading: false,
    isSaving: false,
  }),
  actions: {
    clearCurrentReview() {
      this.currentReview = null;
      this.currentBookingId = null;
      this.isLoading = false;
    },

    async fetchByBooking(bookingId: string) {
      const { handleError } = useErrorHandler();
      this.currentBookingId = bookingId;
      this.currentReview = null;
      this.isLoading = true;
      try {
        const reviews = await ReviewsService.getByBooking(bookingId);
        if (this.currentBookingId === bookingId) this.currentReview = reviews[0] ?? null;
      } catch (error) {
        if (this.currentBookingId === bookingId) handleError(error, "No pudimos cargar la reseña de esta clase.");
      } finally {
        if (this.currentBookingId === bookingId) this.isLoading = false;
      }
    },

    async createReview(payload: CreateReviewPayload) {
      const { handleError } = useErrorHandler();
      const { handleSuccess } = useSuccessHandler();
      this.isSaving = true;
      try {
        this.currentReview = await ReviewsService.create(payload);
        handleSuccess("Tu reseña fue publicada correctamente.");
        return true;
      } catch (error) {
        handleError(error, "No pudimos publicar tu reseña.");
        return false;
      } finally {
        this.isSaving = false;
      }
    },

    async updateReview(id: string, payload: UpdateReviewPayload) {
      const { handleError } = useErrorHandler();
      const { handleSuccess } = useSuccessHandler();
      this.isSaving = true;
      try {
        this.currentReview = await ReviewsService.update(id, payload);
        handleSuccess("Tu reseña fue actualizada correctamente.");
        return true;
      } catch (error) {
        handleError(error, "No pudimos actualizar tu reseña.");
        return false;
      } finally {
        this.isSaving = false;
      }
    },

    async deleteReview(id: string) {
      const { handleError } = useErrorHandler();
      const { handleSuccess } = useSuccessHandler();
      this.isSaving = true;
      try {
        await ReviewsService.delete(id);
        this.currentReview = null;
        handleSuccess("Tu reseña fue eliminada correctamente.");
        return true;
      } catch (error) {
        handleError(error, "No pudimos eliminar tu reseña.");
        return false;
      } finally {
        this.isSaving = false;
      }
    },
  },
});
