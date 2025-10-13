import { apiCLient } from "../Api"

export const getCollegeFees = ()=>{
    return apiCLient.get('/api/collegefees/get')
}

export const postCollegeFees =(data:any)=>{
    return apiCLient.post('/api/collegefees/create',data)
}

export const putCollegeFees = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/collegefees/update/${_id}`, rest);
}

export const deleteCollegeFees = (id: string) => {
    return apiCLient.delete(`/api/collegefees/delete/${id}`)
}