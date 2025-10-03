import { apiCLient } from "../Api"

export const getCollegeAccount = ()=>{
    return apiCLient.get('/api/collegeaccount/get')
}

