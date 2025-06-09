import { apiCLient } from "../Api"


export const getAccountant = ()=>{
    return apiCLient.get('/api/accountant/get')
}

export const postAccountant =(data:any)=>{
    return apiCLient.post('/api/accountant/create',data)
}

export const putAccountant = (data:any)=>{
    return apiCLient.put('/api/accountant/update',data)
}

export const deleteAccountant = (data:any)=>{
    return apiCLient.put('/api/accountant/delete',data)
}