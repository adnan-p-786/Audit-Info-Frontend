import { useMutation } from "react-query"
import { postAknwoledgment } from "./aknwoledmentApi"

export const useCreateAknwoledgment = () => {
    return useMutation((data:{id:string,data:any}) => postAknwoledgment(data))
}

// export const useUpdateAgentAccount = () => {
//     return useMutation((data: any) => putAgentAccount(data))
// }

// export const useDeleteAgentAccount = () => {
//     return useMutation((data: any) => deleteAgentAccount(data))
// }

