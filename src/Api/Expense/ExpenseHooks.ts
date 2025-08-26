import { useMutation } from "react-query"
import { deleteExpense, postExpense } from "./ExpenseApi"

export const useCreateExpense = () => {
    return useMutation((data: any) => postExpense(data))
}

export const useDeleteExpense = () => {
    return useMutation((data: any) => deleteExpense(data))
}
