import { AuthResponse, LoginCredentials } from "@/types/auth";
import http from "./http";

const prefix = '/users/auth'

export class AuthService {
    
    async login(credentials: LoginCredentials) {
        const { data } = await http.post<AuthResponse>(`${prefix}/login`, credentials, {withCredentials: true,});
        return data;
    }
}

export default new AuthService()