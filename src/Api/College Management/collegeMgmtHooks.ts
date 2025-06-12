import { useMutation } from "react-query"
import { deleteCollegeManagement, postCollegeManagement, putCollegeManagement } from "./collegeMgmtApi"

export const useCreateCollegeManagement = () => {
    return useMutation((data: any) => postCollegeManagement(data))
}

export const useUpdateCollegeManagement = () => {
    return useMutation((data: any) => putCollegeManagement(data))
}

export const useDeleteCollegeManagement = () => {
    return useMutation((data: any) => deleteCollegeManagement(data))
}

