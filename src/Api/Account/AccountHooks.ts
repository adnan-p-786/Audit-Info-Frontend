import { useMutation } from "react-query"
import { deleteAccount, postAccount, putAccount } from "./AccountApi"

export const useCreateAccount = () => {
    return useMutation((data: any) => postAccount(data))
}

export const useUpdateAccount = () => {
    return useMutation((data: any) => putAccount(data))
}

export const useDeleteAccount = () => {
    return useMutation((data: any) => deleteAccount(data))
}

