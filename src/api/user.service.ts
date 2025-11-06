import { BaseService } from "./base.service";

export class UsersServiceClass extends BaseService {
    constructor(){
        super('/users') // prefijo
    }
}

export const UsersService = new UsersServiceClass()