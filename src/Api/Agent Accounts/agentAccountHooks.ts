import { useMutation } from "react-query"
import { deleteAgentAccount, postAgentAccount, putAgentAccount } from "./agentAccountApi"

export const useCreateAgentAccount = () => {
    return useMutation((data: any) => postAgentAccount(data))
}

export const useUpdateAgentAccount = () => {
    return useMutation((data: any) => putAgentAccount(data))
}

export const useDeleteAgentAccount = () => {
    return useMutation((data: any) => deleteAgentAccount(data))
}

