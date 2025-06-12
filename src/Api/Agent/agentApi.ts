import { apiCLient } from "../Api"


export const getAgent = ()=>{
    return apiCLient.get('/api/agent/get')
}

export const postAgent =(data:any)=>{
    return apiCLient.post('/api/agent/create',data)
}

export const putAgent = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/agent/update/${_id}`, rest);
}


export const deleteAgent = (id: string) => {
    return apiCLient.delete(`/api/agent/delete/${id}`)
}