import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartState {
  items: Product[];
  demo:any
}

const initialState: CartState = {
  items: [],
  demo:null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setMaxConfig:(state,action:PayloadAction<any>)=>{
      state.demo = action.payload;
    }

  },
});

export const { addToCart, removeFromCart, clearCart, setMaxConfig } = cartSlice.actions;
export default cartSlice.reducer;