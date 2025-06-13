import axios from "axios"

export const baseUrl = "https://audit-info-backend.onrender.com"
export const apiCLient = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})