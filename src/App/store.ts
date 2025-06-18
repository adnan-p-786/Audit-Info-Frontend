import { configureStore } from "@reduxjs/toolkit";
import leadHistoryReducer from '../Redux/leadSlice'

const store = configureStore({
    reducer: {
        leadHistory:leadHistoryReducer
    },
});

export default store