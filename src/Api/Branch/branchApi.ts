import { apiCLient } from "../Api"


export const getBranch = ()=>{
    return apiCLient.get('/api/branch/get')
}

export const postBranch =(data:any)=>{
    return apiCLient.post('/api/branch/create',data)
}

export const putBranch = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/branch/update/${_id}`, rest);
}


export const deleteBranch = (id: string) => {
    return apiCLient.delete(`/api/branch/delete/${id}`)
}