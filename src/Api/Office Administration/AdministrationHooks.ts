import { useMutation } from "react-query"
import { deleteOfficeAdministration, postOfficeAdministration, putOfficeAdministration } from "./AdministrationApi"

export const useCreateOfficeAdministration = () => {
    return useMutation((data: any) => postOfficeAdministration(data))
}

export const useUpdateOfficeAdministration = () => {
    return useMutation((data: any) => putOfficeAdministration(data))
}

export const useDeleteOfficeAdministration = () => {
    return useMutation((data: any) => deleteOfficeAdministration(data))
}

