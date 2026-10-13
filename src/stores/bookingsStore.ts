import { defineStore } from "pinia";
import { BookingsService } from "@/api/bookings.service";
import { useErrorHandler, useSuccessHandler } from '@/composables/useAlertsHandler';
import { useDashboardStore } from "@/stores/dashboardStore";
import { useUserStore } from "@/stores/userStore";
import { BookingsType } from "@/types/bookings";

export const useBookingsStore = defineStore('bookings', {
    state: () => ({
        tutorBookings: [] as Array<any>,
        studentBookings: [] as Array<any>,
        isLoading: false,
        isLoadingStudent: false,
        loadedTutorId: null as string | null
        ,loadedStudentId: null as string | null
    }),
    getters: {
        acceptedBookings: (state) => {
            return state.tutorBookings
                .filter(b => b.status === 'Cancelada' || b.status === 'Completada' || b.status === 'Aceptada')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).reverse();
        },
        pendingBookings: (state) => {
            return state.tutorBookings
                .filter(b => b.status === 'Pendiente por aceptar')
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
                console.log('entro')
                const data = await BookingsService.getByTutor(tutorId);
                this.tutorBookings = data;
                console.log(data.filter(s => !s.subject.name))
                this.loadedTutorId = tutorId;
            } catch (error) {
                handleError(error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchBookingsByStudent(studentId: string) {
            if (this.loadedStudentId === studentId && this.studentBookings.length >= 0) return;
            const { handleError } = useErrorHandler();
            this.studentBookings = [];
            this.isLoadingStudent = true;
            try {
                const data = await BookingsService.getByStudent(studentId);
                console.log(data)
                this.studentBookings = data;
                this.loadedStudentId = studentId;
            } catch (error) {
                handleError(error);
            } finally {
                this.isLoadingStudent = false;
            }
        },

        async acceptBooking(bookingId: string) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler();
            this.isLoading = true;
            try {
                await BookingsService.update(bookingId, { status: 'Aceptada' });
                const index = this.tutorBookings.findIndex(b => b._id === bookingId);
                if (index !== -1) {
                    this.tutorBookings[index].status = 'Aceptada';
                    await useDashboardStore().refreshDashboardsByTutor(this.tutorBookings[index].tutorId);
                }
                handleSuccess('Reserva aceptada con éxito');
            } catch (error) {
                handleError(error);
            } finally {
                this.isLoading = false;
            }
        },

        async rejectBooking(booking: BookingsType) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler();
            this.isLoading = true;
            try {
                await BookingsService.update(booking._id, { status: 'Cancelada' });
                const index = this.tutorBookings.findIndex(b => b._id === booking._id);
                if (index !== -1) {
                    this.tutorBookings[index].status = 'Cancelada';
                    await useDashboardStore().refreshDashboardsByTutor(this.tutorBookings[index].tutorId);
                }
                await useUserStore().adjustBalance(booking.student._id, Number(booking.price || 0) + Number(booking.discount || 0));
                handleSuccess('Reserva rechazada');
            } catch (error) {
                handleError(error);
            } finally {
                this.isLoading = false;
            }
        },

        async cancelBookingByStudent(booking: BookingsType) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler();
            try {
                await BookingsService.update(booking._id, { status: 'Cancelada' });
                const index = this.studentBookings.findIndex(item => item._id === booking._id);
                if (index !== -1) this.studentBookings[index] = { ...this.studentBookings[index], status: 'Cancelada' };
                handleSuccess('Clase cancelada');
                return true;
            } catch (error) {
                handleError(error);
                return false;
            }
        },

        async cancelAcceptedBookingByTutor(booking: BookingsType) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler();
            this.isLoading = true;
            try {
                await BookingsService.update(booking._id, { status: 'Cancelada' });
                const index = this.tutorBookings.findIndex(item => item._id === booking._id);
                if (index !== -1) {
                    this.tutorBookings[index] = { ...this.tutorBookings[index], status: 'Cancelada' };
                    await useDashboardStore().refreshDashboardsByTutor(booking.tutorId);
                }
                await useUserStore().adjustBalance(booking.student._id, Number(booking.price || 0) + Number(booking.discount || 0));
                handleSuccess('Clase cancelada y saldo acreditado al estudiante');
                return true;
            } catch (error) {
                handleError(error);
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async rescheduleBookingByStudent(booking: BookingsType, date: string, startTime: string, endTime: string) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler();
            try {
                await BookingsService.update(booking._id, {
                    date,
                    startTime,
                    endTime,
                    status: 'Pendiente por aceptar',
                });
                const index = this.studentBookings.findIndex(item => item._id === booking._id);
                if (index !== -1) {
                    this.studentBookings[index] = {
                        ...this.studentBookings[index],
                        date,
                        startTime,
                        endTime,
                        status: 'Pendiente por aceptar',
                    };
                }
                handleSuccess('Cambio de horario enviado al profesor');
                return true;
            } catch (error) {
                handleError(error);
                return false;
            }
        },

        async completeBooking(bookingId: string) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler();
            this.isLoading = true;
            try {
                const booking = this.tutorBookings.find(item => item._id === bookingId);
                await BookingsService.update(bookingId, { status: 'Completada' });
                const index = this.tutorBookings.findIndex(b => b._id === bookingId);
                if (index !== -1) {
                    this.tutorBookings[index].status = 'Completada';
                    await useDashboardStore().refreshDashboardsByTutor(this.tutorBookings[index].tutorId);
                }
                if (booking) {
                    await useUserStore().adjustBalance(booking.tutorId, Number(booking.price || 0) + Number(booking.discount || 0));
                }
                handleSuccess('La clase se marcó como completada.');
            } catch (error) {
                handleError(error);
            } finally {
                this.isLoading = false;
            }
        },

        async refreshBookingsByTutor(tutorId: string) {
            this.loadedTutorId = null;
            await this.fetchBookingsByTutor(tutorId);
        },

        async refreshBookingsByStudent(studentId: string) {
            this.loadedStudentId = null;
            await this.fetchBookingsByStudent(studentId);
        }
    }
});
