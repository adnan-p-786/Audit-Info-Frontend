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
