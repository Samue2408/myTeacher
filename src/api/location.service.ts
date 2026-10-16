import axios from "axios";

interface CountriesResponse {
  error: boolean;
  msg: string;
  data: Array<{ name: string }> | string[];
}

const http = axios.create({
  baseURL: "https://countriesnow.space/api/v0.1",
  headers: { "Content-Type": "application/json" },
});

export class LocationService {
  async getCountries(): Promise<string[]> {
    const { data } = await http.get<CountriesResponse>("/countries/positions");
    if (data.error || !Array.isArray(data.data)) {
      throw new Error(data.msg || "No fue posible cargar los países.");
    }

    return data.data
      .map((country) => (typeof country === "string" ? country : country.name))
      .filter((country): country is string => Boolean(country))
      .sort((first, second) => first.localeCompare(second, "es"));
  }

  async getCities(country: string): Promise<string[]> {
    const { data } = await http.post<CountriesResponse>("/countries/cities", { country });
    if (data.error || !Array.isArray(data.data)) {
      throw new Error(data.msg || "No fue posible cargar las ciudades.");
    }

    return data.data
      .filter((city): city is string => typeof city === "string" && Boolean(city))
      .sort((first, second) => first.localeCompare(second, "es"));
  }
}

export default new LocationService();
