import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { studentHistoryReducer } from "../Redux/studentSlice";
import { leadHistoryReducer } from "../Redux/leadSlice";
import authReducer from "../Redux/authSlice";


import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  leadHistory: leadHistoryReducer,
  studentHistory: studentHistoryReducer,
  auth: authReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // reducers you want to persist
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
});

// Persistor for <PersistGate>
export const persistor = persistStore(store);
