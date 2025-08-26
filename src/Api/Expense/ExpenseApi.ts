import { apiCLient } from "../Api"


export const getExpense = ()=>{
    return apiCLient.get('/api/expense/get')
}

export const postExpense =(data:any)=>{
    return apiCLient.post('/api/expense/create',data)
}

export const deleteExpense = (id: string) => {
    return apiCLient.delete(`/api/expense/delete/${id}`)
}