import { apiCLient } from "../Api"


export const getAccount = ()=>{
    return apiCLient.get('/api/account/get')
}

export const getServiceCharge = (id:string)=>{
    return apiCLient.get(`/api/account/get-servicecharge/${id}`);
}

export const getTransaction = (id:string)=>{
    return apiCLient.get(`/api/account/get-transaction/${id}`);
}

export const postAddAmount =(data:{id:string,data:any})=>{
    return apiCLient.post(`/api/account/addamount/${data.id}`,data.data)
}

export const postconfirmCollegeFee =(data:{id:string,data:any})=>{
    return apiCLient.post(`/api/account/confirmcollegefee/${data.id}`,data.data)
}

export const postServiceCharge =(data:{id:string,data:any})=>{
    return apiCLient.post(`/api/account/servicecharge/${data.id}`,data.data)
}

export const postcollectpayment =(data:{id:string,data:any})=>{
    return apiCLient.post(`/api/account/collect-Payment/${data.id}`,data.data)
}

export const postAccount =(data:{id:string, data:any})=>{
    return apiCLient.post(`/api/account/create/${data.id}`,data.data)
}

export const putConfirmBooking =(data:{id:string, data:any})=>{
    return apiCLient.put(`/api/account/confirm/${data.id}`,data.data)
}

export const postBookingamount =(data:{id:string, data:any})=>{
    return apiCLient.post(`/api/account/booking/${data.id}`,data.data)
}

export const putAccount = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/account/update/${_id}`, rest);
}


export const deleteAccount = (id: string) => {
    return apiCLient.delete(`/api/account/delete/${id}`)
}