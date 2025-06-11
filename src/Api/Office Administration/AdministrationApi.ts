import { apiCLient } from "../Api"


export const getOfficeAdministration = ()=>{
    return apiCLient.get('/api/administractor/get')
}

export const postOfficeAdministration =(data:any)=>{
    return apiCLient.post('/api/administractor/create',data)
}

export const putOfficeAdministration = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/administractor/update/${_id}`, rest);
}


export const deleteOfficeAdministration = (id: string) => {
    return apiCLient.delete(`/api/administractor/delete/${id}`)
}