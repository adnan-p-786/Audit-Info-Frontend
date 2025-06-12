import { apiCLient } from "../Api"


export const getAgentAccount = ()=>{
    return apiCLient.get('/api/agentaccount/get')
}

export const postAgentAccount =(data:any)=>{
    return apiCLient.post('/api/agentaccount/create',data)
}

export const putAgentAccount = (data: any) => {
  const { _id, ...rest } = data;
  return apiCLient.put(`/api/agentaccount/update/${_id}`, rest);
}


export const deleteAgentAccount = (id: string) => {
    return apiCLient.delete(`/api/agentaccount/delete/${id}`)
}