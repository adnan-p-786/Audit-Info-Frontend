import { useMutation } from "react-query"
import { deleteLead, postLead, putLead, uploadLeadExcel } from "./leadApi"

export const useCreateLead = () => {
    return useMutation((data: any) => postLead(data))
}

export const useUpdateLead = () => {
    return useMutation((data: any) => putLead(data))
}

export const useDeleteLead = () => {
    return useMutation((data: any) => deleteLead(data))
}


export const useUploadLead = () => {
    return useMutation((data: any) => uploadLeadExcel(data))
}

