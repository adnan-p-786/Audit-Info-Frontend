import { apiCLient } from "../Api"


export const getLead = ()=>{
    return apiCLient.get('/api/lead/get')
}

export const postLead =(data:any)=>{
    return apiCLient.post('/api/lead/create',data)
}

export const uploadLeadExcel =(data:any)=>{
    return apiCLient.post('/api/lead/uploadEXCEL',data)
}

export const putLead = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/lead/update/${_id}`, rest);
}


export const deleteLead = (id: string) => {
    return apiCLient.delete(`/api/lead/delete/${id}`)
}