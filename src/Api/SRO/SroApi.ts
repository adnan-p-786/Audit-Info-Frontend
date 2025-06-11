import { apiCLient } from "../Api"

export const getSro = ()=>{
    return apiCLient.get('/api/sro/get')
}

export const postSro =(data:any)=>{
    return apiCLient.post('/api/sro/create',data)
}

export const putSro = (data:any)=>{
    const { _id, ...rest } = data;
    return apiCLient.put(`/api/sro/update/${_id}`, rest);
}

export const deleteSro = (id:string)=>{
    return apiCLient.delete(`/api/sro/delete/${id}`)
}