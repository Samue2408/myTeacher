import type { CustomEmailPayload } from "@/types/auth";
import http from "./http";

export class EmailService {
  async sendCustom(payload: CustomEmailPayload): Promise<void> {
    await http.post("/emails/send-custom", payload);
  }
}

export default new EmailService();
