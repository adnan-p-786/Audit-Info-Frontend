import { apiCLient } from "../Api"


export const postAknwoledgment = (data:{id: string, data: any}) => {
  return apiCLient.post(`/api/aknowledgement/create/${data.id}`,data.data, {
    headers: {
            "Content-Type": "multipart/form-data"
        }
  })
}


export const getAknwoledgment = ()=>{
    return apiCLient.get('/api/aknowledgement/get')
}


// export const putAknwoledgment = (data: any) => {
//   const { _id, ...rest } = data;
//   return apiCLient.put(`/api/aknowledgement/update/${_id}`, rest);
// }


// export const deleteAknwoledgment = (id: string) => {
//     return apiCLient.delete(`/api/aknowledgement/delete/${id}`)
// }