import { apiCLient } from "../Api"


export const getAccountant = ()=>{
    return apiCLient.get('/api/accountant/get')
}

export const postAccountant =(data:any)=>{
    return apiCLient.post('/api/accountant/create',data)
}

export const putAccountant = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/accountant/update/${_id}`, rest);
}


export const deleteAccountant = (id: string) => {
    return apiCLient.delete(`/api/accountant/delete/${id}`)
}