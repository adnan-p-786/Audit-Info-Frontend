import { useMutation } from "react-query"
import { loginUser } from "./userApi"

export const useCreateSro = () => {
    return useMutation((data: any) => loginUser(data))
}