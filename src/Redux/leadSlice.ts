import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    leadHistory : {}
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


export const {setLeadHistory} = leadHistorySlice.actions
export default leadHistorySlice.reducer