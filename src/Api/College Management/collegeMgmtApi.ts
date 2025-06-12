import { apiCLient } from "../Api"

export const getCollegeManagement = ()=>{
    return apiCLient.get('/api/collegemanagement/get')
}

export const postCollegeManagement =(data:any)=>{
    return apiCLient.post('/api/collegemanagement/create',data)
}

export const putCollegeManagement = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/collegemanagement/update/${_id}`, rest);
}

export const deleteCollegeManagement = (id: string) => {
    return apiCLient.delete(`/api/collegemanagement/delete/${id}`)
}