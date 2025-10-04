import axios from "axios";
import type { WildfireLocationsResponse } from "../types/WildfireLocations";

const api = axios.create({
  baseURL: "http://localhost/api",
});

export default async function fetchWildfireLocations(): Promise<WildfireLocationsResponse> {
  return (await api.get("/wildfire")).data;
}
