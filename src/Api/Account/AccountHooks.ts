import { useMutation } from "react-query"
import { deleteAccount, postAccount, postAddAmount, postBookingamount, postcollectpayment, postconfirmCollegeFee, postconfirmrefund, postServiceCharge, putAccount, putConfirmBooking } from "./AccountApi"

export const useCreateAccount = () => {
    return useMutation((data:{id:string,data:any}) => postAccount(data))
}

export const useCreateServiceCharge = () => {
    return useMutation((data:{id:string,data:any}) => postServiceCharge(data))
}

export const useConfirmcollegefee = () => {
    return useMutation((data:{id:string,data:any}) => postconfirmCollegeFee(data))
}

export const useConfirmRefund = () => {
    return useMutation((data:{id:string,data:any}) => postconfirmrefund(data))
}

export const useCreateAddAmount = () => {
    return useMutation((data:{id:string,data:any}) => postAddAmount(data))
}

export const useCreateCollectPayment = () => {
    return useMutation((data:{id:string,data:any}) => postcollectpayment(data))
}

export const useConfirmBooking = () => {
    return useMutation((data:{id:string,data:any}) => putConfirmBooking(data))
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

