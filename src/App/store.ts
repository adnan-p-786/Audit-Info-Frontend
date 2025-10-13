import { configureStore } from "@reduxjs/toolkit";
import { leadHistoryReducer, studentHistoryReducer } from "../Redux/leadSlice";

const store = configureStore({
  reducer: {
    leadHistory: leadHistoryReducer,
    studentHistory: studentHistoryReducer,
  },
});

export default store;
