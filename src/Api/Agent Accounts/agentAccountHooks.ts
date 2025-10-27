import { useMutation } from "react-query"
import { deleteAgentAccount, postAgentAccount, postconfirmagentpymnt, putAgentAccount } from "./agentAccountApi"

export const useCreateAgentAccount = () => {
    return useMutation((data: any) => postAgentAccount(data))
}

export const useUpdateAgentAccount = () => {
    return useMutation((data: any) => putAgentAccount(data))
}

export const useDeleteAgentAccount = () => {
    return useMutation((data: any) => deleteAgentAccount(data))
}

export const useConfirmAgentpymt = () => {
    return useMutation((data:{id:string,data:any}) => postconfirmagentpymnt(data))
}

