import { apiCLient } from "../Api"


export const getLeadHistory = ()=>{
    return apiCLient.get('/api/leadhistory/get')
}

export const postLeadHistory =(data:any)=>{
    return apiCLient.post('/api/leadhistory/create',data)
}

export const putLeadHistory = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/leadhistory/update/${_id}`, rest);
}


export const deleteLeadHistory = (id: string) => {
    return apiCLient.delete(`/api/leadhistory/delete/${id}`)
}