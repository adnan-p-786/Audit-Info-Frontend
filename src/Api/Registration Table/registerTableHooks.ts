import { useMutation } from "react-query"
import { deleteRegister, postRegister, putRegister } from "./registerTableApi"


export const useCreateRegister = () => {
    return useMutation((data: any) => postRegister(data))
}

export const useUpdateRegister = () => {
    return useMutation((data: any) => putRegister(data))
}

export const useDeleteRegister = () => {
    return useMutation((data: any) => deleteRegister(data))
}

