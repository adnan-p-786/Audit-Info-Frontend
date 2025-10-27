import { apiCLient } from "../Api"

export const getUser = ()=>{
    return apiCLient.get('/api/user/get')
}