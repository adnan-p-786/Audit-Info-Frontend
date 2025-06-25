import { apiCLient } from "../Api"


export const getAccount = ()=>{
    return apiCLient.get('/api/account/get')
}

export const postAccount =(data:any)=>{
    return apiCLient.post('/api/account/create',data)
}

export const putAccount = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/account/update/${_id}`, rest);
}


export const deleteAccount = (id: string) => {
    return apiCLient.delete(`/api/account/delete/${id}`)
}