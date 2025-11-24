export interface DashboardResponse {
  message: string;
  stats: Stats;
  students: StudentByDay[];
  nextBookings: Booking[];
}

export interface Stats {
  students: number;
  income: number;
  canceledClasses: number;
  pendingRequests: number;

  studentsLastPerium: number;
  incomeLastPerium: number;
  canceledClassesLastPerium: number;
  pendingRequestsLastPerium: number;

  diferenceIncomePercentage: number;
  diferenceStudents: number;
  diferenceCanceledClasses: number;
  diferencePendingRequests: number;
}

export interface StudentByDay {
  day: number;
  count: number;
}

export interface Booking {
  _id: string;
  type: "Presencial" | "Virtual";
  location: string;
  status: "Aceptada" | "Pendiente" | "Cancelada";
  date: string;          // ISO string
  startTime: string;     // "HH:mm"
  endTime: string;       // "HH:mm"
  price: number;
  startDateTime: string; // ISO string
  student: BookingStudent;
  subject: BookingSubject;
}

export interface BookingStudent {
  _id: string;
  name: string;
}

export interface BookingSubject {
  _id: string;
  name: string;
}
