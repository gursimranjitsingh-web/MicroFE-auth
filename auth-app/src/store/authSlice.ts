import { createSlice } from '@reduxjs/toolkit';

interface UserData {
  name: string;
  role: string;
  permissions: string[];
  theme: string;
}

interface AuthState {
  token: string | null;
  userData: UserData | null;
}

const initialState: AuthState = {
  token: null,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      // Simulate authentication
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const userData: UserData = {
        name: 'John Doe',
        role: 'user',
        permissions: ['read'],
        theme: 'light',
      };
      state.token = token;
      state.userData = userData;
    },
    logout: (state) => {
      state.token = null;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;