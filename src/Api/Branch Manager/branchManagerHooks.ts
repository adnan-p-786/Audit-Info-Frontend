import { useMutation } from "react-query"
import { deleteBranchManager, postBranchManager, putBranchManager } from "./branchManagerApi"


export const useCreateBranchManager = () => {
    return useMutation((data: any) => postBranchManager(data))
}

export const useUpdateBranchManager = () => {
    return useMutation((data: any) => putBranchManager(data))
}

export const useDeleteBranchManager = () => {
    return useMutation((data: any) => deleteBranchManager(data))
}

