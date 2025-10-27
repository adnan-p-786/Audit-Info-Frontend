import { useMutation } from "react-query"
import { deletePayments, postPayments, putPayments } from "./paymentApi"


export const useCreatePayments = () => {
    return useMutation((data: any) => postPayments(data))
}

export const useUpdatePayments = () => {
    return useMutation((data: any) => putPayments(data))
}

export const useDeletePayments = () => {
    return useMutation((data: any) => deletePayments(data))
}
