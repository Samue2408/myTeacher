// src/services/auth.service.ts
import { AuthResponse, LoginCredentials, SignUpPayload } from "@/types/auth";
import http from "./http";

const prefix = '/users/auth';   

export class AuthService {

  async login(credentials: LoginCredentials) {
    const { data } = await http.post<AuthResponse>(`${prefix}/login`, credentials, { withCredentials: true });
    return data;
  }

  async signUp(payload: SignUpPayload) {
    const { data } = await http.post<AuthResponse>(`${prefix}/register`, payload, { withCredentials: true });
    return data;
  }
}

export default new AuthService();
