import { apiCLient } from "../Api"


export const getRegister = ()=>{
    return apiCLient.get('/api/registrationtable/get')
}

export const postService =(data:any)=>{
    return apiCLient.post('/api/registrationtable/create-service',data)    
}

export const postRegister =(data:any)=>{
    return apiCLient.post('/api/registrationtable/create',data)    
}

export const putRegister = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/registrationtable/update/${_id}`, rest);
}


export const deleteRegister = (id: string) => {
    return apiCLient.delete(`/api/registrationtable/delete/${id}`)
}