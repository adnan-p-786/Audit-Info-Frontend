import { apiCLient } from "../Api"

export const postSro =(data:any)=>{
    return apiCLient.post('/api/sro/create',data)
}

export const getSro = ()=>{
    return apiCLient.get('/api/sro/get')
}

export const putSro = (data:any)=>{
    return apiCLient.put('/api/sro/update',data)
}

export const deleteSro = (data:any)=>{
    return apiCLient.put('/api/sro/delete',data)
}