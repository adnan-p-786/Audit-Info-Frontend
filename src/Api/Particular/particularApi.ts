import { apiCLient } from "../Api"


export const getParticular = ()=>{
    return apiCLient.get('/api/particular/get')
}

export const postParticular =(data:any)=>{
    return apiCLient.post('/api/particular/create',data)    
}

export const putParticular = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/particular/update/${_id}`, rest);
}


export const deleteParticular = (id: string) => {
    return apiCLient.delete(`/api/particular/delete/${id}`)
}