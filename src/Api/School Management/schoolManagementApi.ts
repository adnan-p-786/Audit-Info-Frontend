import { apiCLient } from "../Api"

export const getSchoolmanagement = ()=>{
    return apiCLient.get('/api/schoolmanagement/get')
}

export const postSchoolmanagement =(data:any)=>{
    return apiCLient.post('/api/schoolmanagement/create',data)
}

export const putSchoolmanagement = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/schoolmanagement/update/${_id}`, rest);
}

export const deleteSchoolmanagement = (id: string) => {
    return apiCLient.delete(`/api/schoolmanagement/delete/${id}`)
}