import http from "./http"
import { SubjectsType } from "@/types/subjects";
import { BaseService } from "./base.service";

export class SubjectsServiceClass extends BaseService {
    constructor(){
        super('/subjects') // prefijo
    }

    async getByTutor(tutorId: string): Promise<SubjectsType[]> {
        try {
            const response = await http.get<SubjectsType[]>(`${this.basePath}/subjectsBytutorId/${tutorId}`)
            return response.data;
        } catch(error){
            throw new Error(
                error.response?.data?.message || "Error al obtener las materias."
            )
        }
    }

}

export const SubjectsService = new SubjectsServiceClass()