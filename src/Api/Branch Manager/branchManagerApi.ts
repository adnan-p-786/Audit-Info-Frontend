import { apiCLient } from "../Api"

export const getBranchManager = ()=>{
    return apiCLient.get('/api/manager/get')
}

export const postBranchManager =(data:any)=>{
    return apiCLient.post('/api/manager/create',data)
}

export const putBranchManager = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/manager/update/${_id}`, rest);
}

export const deleteBranchManager = (id: string) => {
    return apiCLient.delete(`/api/manager/delete/${id}`)
}