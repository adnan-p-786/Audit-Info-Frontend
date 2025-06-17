import { useMutation } from "react-query"
import { deleteLeadHistory, postLeadHistory, putLeadHistory } from "./leadHistoryApi"

export const useCreateLeadHistory = () => {
    return useMutation((data: any) => postLeadHistory(data))
}

export const useUpdateLeadHistory = () => {
    return useMutation((data: any) => putLeadHistory(data))
}

export const useDeleteLeadHistory = () => {
    return useMutation((data: any) => deleteLeadHistory(data))
}

