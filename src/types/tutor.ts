export interface Tutor {
  id: number
  name: string
  balance: number
  email: string
  role: string
  validatedTeacher: boolean
  phone: string
  location: Location
  subject: string
  price: number
  description: string
  img: string
  reputation: Reputacion
}

interface Reputacion{
  rating: number
  rewiewsCount: number
}

interface Location{
  city: string
  country: string
}