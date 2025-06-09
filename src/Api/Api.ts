import axios from "axios"

export const baseUrl = "http://localhost:3000"
export const apiCLient = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})