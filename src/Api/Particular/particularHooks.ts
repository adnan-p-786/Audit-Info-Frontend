import { useMutation } from "react-query"
import { deleteParticular, postParticular, putParticular } from "./particularApi"


export const useCreateParticular = () => {
    return useMutation((data: any) => postParticular(data))
}

export const useUpdateParticular = () => {
    return useMutation((data: any) => putParticular(data))
}

export const useDeleteParticular = () => {
    return useMutation((data: any) => deleteParticular(data))
}

