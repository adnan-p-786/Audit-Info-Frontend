import { useMutation } from "react-query"
import { deleteSro, postSro, putSro } from "./SroApi"

export const useCreateSro = () => {
    return useMutation((data: any) => postSro(data))
}

export const useUpdateSro = () => {
    return useMutation((data: any) => putSro(data))
}

export const useDeleteSro = () => {
    return useMutation((data: any) => deleteSro(data))
}

