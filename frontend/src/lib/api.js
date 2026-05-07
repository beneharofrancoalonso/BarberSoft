import axios from "axios";

export const API_BASE_URL = "http://localhost:3001/api/v1";

export function createApiClient(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.create({
    baseURL: API_BASE_URL,
    headers,
  });
}
