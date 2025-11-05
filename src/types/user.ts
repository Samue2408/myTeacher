type User = {
  id: string
  name: string,
  email: string,
  role: string,
  phone?: string,
  balance?: number,
  location?: Object,
  reputation?: Object,
  validatedTeacher?: boolean
}