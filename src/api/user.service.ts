
import { BaseService } from "./base.service";
import http from "./http";

const prefix = '/users/auth'

export class UsersServiceClass extends BaseService {
    constructor(){
        super('/users') // prefijo
    }
    
}

export const UsersService = new UsersServiceClass()