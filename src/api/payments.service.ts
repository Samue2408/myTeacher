import { BaseService } from "./base.service";


export class PaymentsServiceClass extends BaseService {
  constructor() {
    super("/payments");
  }
  
}

export const PaymentsService = new PaymentsServiceClass();
