import { useMutation } from "react-query"
import { loginUser, updatePassword } from "./userApi"

export const useCreateSro = () => {
    return useMutation((data: any) => loginUser(data))
}

export const useUpdatePassword = () => {
    return useMutation((data: any) => updatePassword(data))
}