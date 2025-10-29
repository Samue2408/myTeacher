export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
}

export interface User {
    id: number
    name: string
    email: string
    role?: string
}

export interface AuthResponse {
    user: User
    token: string
}
