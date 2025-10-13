import { useMutation } from "react-query"
import { deleteCollegeFees, postCollegeFees, putCollegeFees } from "./collegeFeesApi"

export const useCreateCollegeFees = () => {
    return useMutation((data: any) => postCollegeFees(data))
}

export const useUpdateCollegeFees = () => {
    return useMutation((data: any) => putCollegeFees(data))
}

export const useDeleteCollegeFees = () => {
    return useMutation((data: any) => deleteCollegeFees(data))
}

