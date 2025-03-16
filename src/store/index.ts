import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import carReducer from './slices/carSlice'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carReducer,
    chat: chatReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 