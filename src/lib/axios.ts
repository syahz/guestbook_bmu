import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.apps.bmuconnect.id/api",
  timeout: 10000,
})

export { api }
