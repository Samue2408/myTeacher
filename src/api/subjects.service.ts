import { BaseService } from "./base.service";

export class SubjectsServiceClass extends BaseService {
    constructor(){
        super('/subjects') // prefijo
    }
}

export const SubjectsService = new SubjectsServiceClass()