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

export interface ChangePasswordPayload {
    email: string
    password: string
    newPassword: string
}

export interface CustomEmailPayload {
    to: string
    subject: string
    previewText: string
    title: string
    message: string
    buttonText: string
    buttonLink: string
}




export interface RegisterData {
    name: string
    email: string
    password: string
}

export interface TokenUser {
    idUser: string
    role: string
    email: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface ChangePasswordResponse {
    message?: string
    error?: string
}
