export interface LoginCredentials {
    email: string
    password: string
}


// SIGN UP
export interface LocationData {
  city: string
  country: string
}

export interface SignUpPayload {
  name: string
  email: string
  password: string
  role: 'student' | 'teacher' | 'admin' | string
  phone?: string
  location?: LocationData
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


