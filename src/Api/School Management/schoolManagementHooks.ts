import { useMutation } from "react-query"
import { deleteSchoolmanagement, postSchoolmanagement, putSchoolmanagement } from "./schoolManagementApi"


export const useCreateSchoolmanagement = () => {
    return useMutation((data: any) => postSchoolmanagement(data))
}

export const useUpdateSchoolmanagement = () => {
    return useMutation((data: any) => putSchoolmanagement(data))
}

export const useDeleteSchoolmanagement = () => {
    return useMutation((data: any) => deleteSchoolmanagement(data))
}

