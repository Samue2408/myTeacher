import type { SubjectSearchResponse } from "@/types/search";
import { Tutor } from "@/types/tutor";

export class SubjectsPipe {
  private mapOne(item: Partial<SubjectSearchResponse>) {
    const tutorData: Partial<Tutor> = {
      name: item.tutorId.name,
      email: item.tutorId.email,
      phone: item.tutorId.phone,
      location: item.tutorId.location,
      reputation: item.tutorId.reputation,
    };

    return {
      id: item._id,
      name: item.name,
      level: item.educationLevel,
      price: item.price,
      tutor: tutorData,
    };
  }

  transform(data: SubjectSearchResponse[]) {
    if (!Array.isArray(data)) return [];
    return data.map((item) => this.mapOne(item));
  }
}

export class currencyPipe {
  transformCurrency(value: string | number) {
    if (value === null || value === undefined) return "";
    const abs = Math.abs(Number(value));

    if (abs >= 1.0e9) return (Number(value) / 1.0e9).toFixed(1) + "B";
    if (abs >= 1.0e6) return (Number(value) / 1.0e6).toFixed(1) + "M";
    if (abs >= 1.0e3) return (Number(value) / 1.0e3).toFixed(1) + "k";
    return value.toString();
  }
  
}
