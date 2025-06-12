import { useMutation } from "react-query"
import { deleteAgent, postAgent, putAgent } from "./agentApi"

export const useCreateAgent = () => {
    return useMutation((data: any) => postAgent(data))
}

export const useUpdateAgent = () => {
    return useMutation((data: any) => putAgent(data))
}

export const useDeleteAgent = () => {
    return useMutation((data: any) => deleteAgent(data))
}

