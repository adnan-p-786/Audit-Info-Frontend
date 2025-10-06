import { useMutation } from "react-query"
import { deleteAccount, postAccount, postBookingamount, putAccount } from "./AccountApi"

export const useCreateAccount = () => {
    return useMutation((data:{id:string,data:any}) => postAccount(data))
}

export const useCreateBookingAmount = () => {
    return useMutation((data: any) => postBookingamount(data))
}

export const useUpdateAccount = () => {
    return useMutation((data: any) => putAccount(data))
}

export const useDeleteAccount = () => {
    return useMutation((data: any) => deleteAccount(data))
}

