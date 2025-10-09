import { useMutation } from "react-query"
import { postAknwoledgment } from "./aknwoledmentApi"

export const useCreateAknwoledgment = () => {
    return useMutation((data:{id:string,data:any}) => postAknwoledgment(data))
}



