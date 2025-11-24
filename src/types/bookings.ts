export interface BookingsType {
  _id: string;
  student: BookingStudent;
  tutorId: string;
  subject: BookingSubject;
  type: "Presencial" | "Virtual";
  location: string;
  status: "Completada" | "Cancelada" | "Pendiente" | "Aceptada";
  date: string;      // ISO string
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  videoCallLink?: string; // solo si aplica
  reviewsCount: number;
  price: number;
}

export interface BookingStudent {
  _id: string;
  name: string;
}

export interface BookingSubject {
  _id: string;
  name: string;
}
