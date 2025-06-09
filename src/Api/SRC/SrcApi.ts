import { apiCLient } from "../Api"

export const postSrc =(data:any)=>{
    return apiCLient.post('/api/src/create',data)
}

export const getSrc = ()=>{
    return apiCLient.get('/api/src/get')
}

export const putSrc = (data:any)=>{
    return apiCLient.put('/api/src/update',data)
}

export const deleteSrc = (data:any)=>{
    return apiCLient.put('/api/src/delete',data)
}