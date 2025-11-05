import http from "./http"

export class BaseService {
  constructor(protected basePath: string) {}

  async getAll() {
    const { data } = await http.get(this.basePath)
    return data
  }

  async getById(id: number | string) {
    const { data } = await http.get(`${this.basePath}/${id}`)
    return data
  }

  async create(payload: any) {
    const { data } = await http.post(`${this.basePath}/create`, payload)
    return data
  }

  async update(id: number | string, payload: any) {
    const { data } = await http.put(`${this.basePath}/update/${id}`, payload)
    return data
  }

  async delete(id: number | string) {
    const { data } = await http.delete(`${this.basePath}/delete/${id}`)
    return data
  }
}
