import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    leadHistory : {}
}

const studentinitialState = {
    studentHistory : {}
}


const leadHistorySlice = createSlice({
    name:"leadHistory",
    initialState:initialState,
    reducers:{
        setLeadHistory:(state,action)=>{
            state.leadHistory=action.payload
        }                    
    }
})

const studentHistorySlice = createSlice({
    name:"studentHistory",
    initialState:studentinitialState,
    reducers:{
        setStudentHistory:(state,action)=>{
            state.studentHistory=action.payload
        }                    
    }
})


export const {setLeadHistory} = leadHistorySlice.actions
export const {setStudentHistory} = studentHistorySlice.actions

export const leadHistoryReducer = leadHistorySlice.reducer
export const studentHistoryReducer = studentHistorySlice.reducer