import { PreferenceResponse } from "@/types/mercadoPago";
import { BaseService } from "./base.service";
import http from "./http";


export class MercadoPagoServiceClass extends BaseService {
  constructor() {
    super("/mercadopago");
  }

  async getPreference(bookingId: string): Promise<PreferenceResponse> {
    try {
      const response = await http.post<PreferenceResponse>(
        `${this.basePath}/create_preference`,
        {bookingId}
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data || error.response?.message || "Error al obtener la referencia de pago"
      );
    }
  }
  
}

export const MercadoPagoService = new MercadoPagoServiceClass();
