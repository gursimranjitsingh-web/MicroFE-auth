import { createSlice } from '@reduxjs/toolkit'
import signInToken from '../../codegenToken'

type UserData =
  | {
      name: string
      role: string
      permissions: string[]
      theme: string
    }
  | any

interface AuthState {
  token: string | null
  userData: UserData | null
  theme: string
}

const initialState: AuthState = {
  token: null,
  userData: null,
  theme: 'dark',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      // Simulate authentication
      const userData: UserData = {
        name: 'John Doe',
        role: 'user',
        permissions: ['read'],
        theme: 'light',
      }
      state.token = signInToken
      state.userData = userData
    },
    logout: (state) => {
      console.log(state)
      // state.token = null;
      // state.userData = null;
    },
    updateUserData: (state, action) => {
      if (state.userData) {
        state.userData.name = action.payload
      }
    },
    setUserData: (state, { payload }) => {
      state.userData = payload
    },
    setTheme: (state, { payload }) => {
      state.theme = payload
    },
  },
})

export const { login, logout, updateUserData, setUserData, setTheme } =
  authSlice.actions
export default authSlice.reducer
