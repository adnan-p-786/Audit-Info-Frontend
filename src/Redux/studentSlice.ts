import { createSlice } from '@reduxjs/toolkit';


const studentinitialState = {
    studentHistory : {}
}

const studentHistorySlice = createSlice({
    name:"studentHistory",
    initialState:studentinitialState,
    reducers:{
        setStudentHistory:(state,action)=>{
            state.studentHistory=action.payload
        }                    
    }
})


export const {setStudentHistory} = studentHistorySlice.actions
export const studentHistoryReducer = studentHistorySlice.reducer