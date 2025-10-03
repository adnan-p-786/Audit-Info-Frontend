import { useMutation } from "react-query"
import { deleteRegister, postRegister, postService, putRegister } from "./registerTableApi"


export const useCreateRegister = () => {
    return useMutation((data: any) => postRegister(data))
}

export const useCreateservice = () => {
    return useMutation((data: {id:string,data:any}) => postService(data))
}

export const useUpdateRegister = () => {
    return useMutation((data: any) => putRegister(data))
}

export const useDeleteRegister = () => {
    return useMutation((data: any) => deleteRegister(data))
}

