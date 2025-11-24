import { defineStore } from "pinia";
import { BookingsService } from "@/api/bookings.service";
import { useErrorHandler, useSuccessHandler } from '@/composables/useAlertsHandler';

export const useBookingsStore = defineStore('bookings', {
    state: () => ({
        tutorBookings: [] as Array<any>,
        isLoading: false,
        loadedTutorId: null as string | null
    }),
    getters: {
        acceptedBookings: (state) => {
            return state.tutorBookings
                .filter(b => b.status === 'Completada' || b.status === 'Cancelada' || b.status === 'Aceptada')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        },
        pendingBookings: (state) => {
            return state.tutorBookings
                .filter(b => b.status === 'Pendiente')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).reverse();
        },
        isLoadedForTutor: (state) => (tutorId: string) =>
            state.loadedTutorId === tutorId && state.tutorBookings.length >= 0,
    },
    actions: {
        async fetchBookingsByTutor(tutorId: string) {
            if (this.isLoadedForTutor(tutorId)) return;
            const { handleError } = useErrorHandler();
            this.tutorBookings = [];
            this.isLoading = true;
            try {
                const data = await BookingsService.getByTutor(tutorId);
                this.tutorBookings = data;
                this.loadedTutorId = tutorId;
            } catch (error) {
                handleError(error);
            } finally {
                this.isLoading = false;
            }
        },

        async acceptBooking(bookingId: string) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler();
            this.isLoading = true;
            try {
                await BookingsService.update(bookingId, { status: 'accepted' });
                const index = this.tutorBookings.findIndex(b => b._id === bookingId);
                if (index !== -1) {
                    this.tutorBookings[index].status = 'accepted';
                }
                handleSuccess('Reserva aceptada con éxito');
            } catch (error) {
                handleError(error);
            } finally {
                this.isLoading = false;
            }
        },

        async rejectBooking(bookingId: string) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler();
            this.isLoading = true;
            try {
                await BookingsService.update(bookingId, { status: 'rejected' });
                this.tutorBookings = this.tutorBookings.filter(b => b._id !== bookingId);
                handleSuccess('Reserva rechazada');
            } catch (error) {
                handleError(error);
            } finally {
                this.isLoading = false;
            }
        },

        async refreshBookingsByTutor(tutorId: string) {
            this.loadedTutorId = null;
            await this.fetchBookingsByTutor(tutorId);
        }
    }
});
