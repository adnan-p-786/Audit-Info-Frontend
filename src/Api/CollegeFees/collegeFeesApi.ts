import { apiCLient } from "../Api"

export const getCollegeFees = (id: string) => {
  return apiCLient.get(`/api/collegefees/get/${id}`);
};


export const getunpaidCollegeFees = ()=>{
    return apiCLient.get('/api/collegefees/get-unpaid')
}

export const postCollegeFees =(data:{id:string,data:any})=>{
    return apiCLient.post(`/api/collegefees/create/${data.id}`,data.data)
}

export const putCollegeFees = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/collegefees/update/${_id}`, rest);
}

export const deleteCollegeFees = (id: string) => {
    return apiCLient.delete(`/api/collegefees/delete/${id}`)
}