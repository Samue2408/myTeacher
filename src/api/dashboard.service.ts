import { BaseService } from "./base.service";

export class DashboardServiceClass extends BaseService {
    constructor(){
        super('/payments/stats') // prefijo
    }
}

export const DashboardService = new DashboardServiceClass()