import { apiCLient } from "../Api"

export const getPayments = ()=>{
    return apiCLient.get('/api/payments/get')
}

export const postPayments =(data:any)=>{
    return apiCLient.post('/api/payments/create',data)    
}

export const putPayments = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/payments/update/${_id}`, rest);
}


export const deletePayments = (id: string) => {
    return apiCLient.delete(`/api/payments/delete/${id}`)
}