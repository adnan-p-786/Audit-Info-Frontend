import { useMutation } from "react-query"
import { deleteSrc, postSrc, putSrc } from "./SrcApi"

export const useCreateSrc = () => {
    return useMutation((data: any) => postSrc(data))
}

export const useUpdateSrc = () => {
    return useMutation((data: any) => putSrc(data))
}

export const useDeleteSrc = () => {
    return useMutation((data: any) => deleteSrc(data))
}

