// src/services/CalendlyService.ts
const BASE_URL = "https://api.calendly.com";

export class CalendlyService {
  private AUTH_TOKEN: string; 
  private headers: Record<string, string>;

  constructor() {
    this.AUTH_TOKEN = import.meta.env.VITE_CALENDLY_PAT;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.AUTH_TOKEN}`,
    };
  }

  async getMyCalendlyUserUUID(): Promise<string | null> {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al obtener el UUID:", errorData);
        return null;
      }

      const data = await response.json();
      return data.resource.uri.split("/").pop();
    } catch (err) {
      console.error("Error en getMyCalendlyUserUUID:", err);
      return null;
    }
  }

  async getEventTypesForUser(tutorUUID: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${BASE_URL}/event_types?user=${BASE_URL}/users/${tutorUUID}`,
        { method: "GET", headers: this.headers }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al obtener Event Types:", errorData);
        return null;
      }

      const data = await response.json();
      return data.collection[0]?.uri || null;
    } catch (err) {
      console.error("Error en getEventTypesForUser:", err);
      return null;
    }
  }

  async createBooking(booking: {
    name?: string;
    startDate: string;
    endDate: string;
    location: string;
    invitees?: { email: string; name: string }[];
  }): Promise<any> {
    const tutorUUID = await this.getMyCalendlyUserUUID();
    if (!tutorUUID) return { error: "No se pudo obtener UUID del tutor" };

    const eventTypeURI = await this.getEventTypesForUser(tutorUUID);
    if (!eventTypeURI) return { error: "No existe Event Type para este tutor" };

    const body = {
      name: booking.name || "Clase de prueba",
      start_time: booking.startDate,
      end_time: booking.endDate,
      location: booking.location,
      invitees: booking.invitees || [],
      owner: `${BASE_URL}/users/${tutorUUID}`,
      event_type: eventTypeURI,
    };

    try {
      const response = await fetch(`${BASE_URL}/scheduled_events`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json();
        return { error: err };
      }

      return await response.json();
    } catch (err) {
      return { error: (err as Error).message };
    }
  }
}
