import { useMutation } from "react-query"
import { deleteAccountant, postAccountant, putAccountant } from "./AccountantApi"

export const useCreateAccountant = () => {
    return useMutation((data: any) => postAccountant(data))
}

export const useUpdateAccountant = () => {
    return useMutation((data: any) => putAccountant(data))
}

export const useDeleteAccountant = () => {
    return useMutation((data: any) => deleteAccountant(data))
}

