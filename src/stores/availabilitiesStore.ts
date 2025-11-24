import { defineStore } from "pinia";
import { AvailabilityService } from "@/api/availability.service";
import { Availabilitytype } from "@/types/user";
import { useErrorHandler, useSuccessHandler } from '@/composables/useAlertsHandler';

export const useAvailabilitiesStore = defineStore('availabilities', {
    state: () => ({
        tutorAvailabilities: [] as Array<Partial<Availabilitytype>>,
        isLoading: true,
        loadedTutorId: null as string | null
    }),
    getters: {
        hasAvailabilitiesRecurrent: (state) => state.tutorAvailabilities.filter(av => av.isRecurring).length > 0,
        hasAvailabilitiesNoRecurrent: (state) => state.tutorAvailabilities.filter(av => !av.isRecurring).length > 0,
        isLoadedForTutor: (state) => (tutorId: string) =>
        state.loadedTutorId === tutorId && state.tutorAvailabilities.length > 0,
    },
    actions: {
        async createAvailability(availabilityData: Partial<Availabilitytype>) {
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler()
            this.loading = true;

            try {
            const created = await AvailabilityService.create(availabilityData);
            this.tutorAvailabilities.push(created);
            handleSuccess('Disponibilidad agregada con éxito')
            } catch (error) {
            handleError(error);
            } finally {
            this.loading = false;
            }
        },

        async fetchAvalabilitiesByTutor(tutorId: string) {
            if (this.isLoadedForTutor(tutorId)) return;
            const { handleError } = useErrorHandler()
            this.tutorAvailabilities = []
            this.isLoading = true;
            try {
                const data: Array<Partial<Availabilitytype>> = await AvailabilityService.getByTutorId(tutorId) as Array<Partial<Availabilitytype>>
                this.tutorAvailabilities = data 
                this.loadedTutorId = tutorId;               
            } catch(error) {
                handleError(error)
            } finally {
                this.isLoading = false;
            }
        },

        async activateAvailability(availabilityData: Availabilitytype){
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler()
    
            this.loading = true;
    
            try {
            await AvailabilityService.update(availabilityData._id, availabilityData);
            this.tutorAvailabilities = this.tutorAvailabilities.map(s => {
                if (s._id == availabilityData._id){
                    // actualizar solo la propiedad `active` en el elemento existente
                    return { ...s, active: availabilityData.active };
                }
                return s;
            })
            handleSuccess('Disponibilidad modificada con éxito')
            } catch (err) {
            handleError(this.errorMessage);
            } finally {
            this.loading = false;
            }
        },

        async updateAvailability(availabilityData: Availabilitytype){
            const { handleError } = useErrorHandler();
            const { handleSuccess } = useSuccessHandler()
    
            this.loading = true;
    
            try {
            await AvailabilityService.update(availabilityData._id, availabilityData);
            handleSuccess('Disponibilidad actualizada con éxito')
            } catch (err) {
            handleError(this.errorMessage);
            } finally {
            this.loading = false;
            }
        },

        async deleteAvailabity(idAvailability: string) {
            const { handleError } = useErrorHandler();
            try {
                const data = await AvailabilityService.delete(idAvailability)
                this.tutorAvailabilities = this.tutorAvailabilities.filter(s => s._id !== idAvailability);

            } catch (error) {
                handleError('No se pude eliminar la materia')

            }
        },

        async refreshAvailabilitysByTutor(tutorId: string) {
            this.loadedTutorId = null;
            await this.fetchAvalabilitiesByTutor(tutorId);
        },
    }
})