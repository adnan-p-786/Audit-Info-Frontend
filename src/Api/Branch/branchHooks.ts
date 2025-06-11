import { useMutation } from "react-query"
import { deleteBranch, postBranch, putBranch } from "./branchApi"

export const useCreateBranch = () => {
    return useMutation((data: any) => postBranch(data))
}

export const useUpdateBranch = () => {
    return useMutation((data: any) => putBranch(data))
}

export const useDeleteBranch = () => {
    return useMutation((data: any) => deleteBranch(data))
}

