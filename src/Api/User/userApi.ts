import { apiCLient } from "../Api"

export const getUser = ()=>{
    return apiCLient.get('/api/user/get')
}

export const loginUser =(data:any)=>{
    return apiCLient.post('/api/user/login',data)
}