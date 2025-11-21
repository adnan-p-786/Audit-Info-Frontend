import { apiCLient } from "../Api"

export const getSrc = ()=>{
    return apiCLient.get('/api/src/get')
}

export const getSrcLeaderboard = ()=>{
    return apiCLient.get('/api/src/leaderboard/src')
}

export const postSrc =(data:any)=>{
    return apiCLient.post('/api/src/create',data)
}

export const putSrc = (data:any)=>{
    const { _id, ...rest } = data;
    return apiCLient.put(`/api/src/update/${_id}`, rest);
}

export const deleteSrc = (id:string)=>{
    return apiCLient.delete(`/api/src/delete/${id}`)
}