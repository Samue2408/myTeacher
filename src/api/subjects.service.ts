import http from "./http"
import { SubjectsType } from "@/types/subjects";
import { SubjectSearchResponse } from "@/types/search";
import { BaseService } from "./base.service";

export class SubjectsServiceClass extends BaseService {
    constructor() {
        super('/subjects') // prefijo
    }

    async getByTutor(tutorId: string): Promise<SubjectsType[]> {
        try {
            const response = await http.get<SubjectsType[]>(`${this.basePath}/subjectsBytutorId/${tutorId}`)
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error al obtener las materias."
            )
        }
    }

    async searchSubjects(query: string): Promise<SubjectSearchResponse[]> {
        try {
            const response = await http.get<SubjectSearchResponse[]>(`${this.basePath}/UserSubjects/${query}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al buscar materias.")
        }
    }

}

export const SubjectsService = new SubjectsServiceClass()