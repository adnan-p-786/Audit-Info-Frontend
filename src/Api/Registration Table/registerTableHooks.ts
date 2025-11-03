import { useMutation } from "react-query"
import { deleteRegister, postRefund, postRegister, postRegisterfromlead, postService, putRegister, updateRegister } from "./registerTableApi"


export const useCreateRegister = () => {
    return useMutation((data: any) => postRegister(data))
}

export const useCreateRegisterfromlead = () => {
    return useMutation((data: any) => postRegisterfromlead(data))
}

export const useCreateservice = () => {
    return useMutation((data: {id:string,data:any}) => postService(data))
}

export const useCreateRefund = () => {
    return useMutation((data: {id:string,data:any}) => postRefund(data))
}

export const useUpdateRegister = () => {
    return useMutation((data: any) => putRegister(data))
}

export const useUpdate = () => {
    return useMutation((data: any) => updateRegister(data))
}

export const useDeleteRegister = () => {
    return useMutation((id: string) => deleteRegister(id))
}

