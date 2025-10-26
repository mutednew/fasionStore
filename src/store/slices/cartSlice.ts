import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface CartItem {
    id?: string;
    productId: string;
    quantity: number;
    name?: string;
    price?: number;
    imageUrl?: string | null;
}

interface CartState {
    id?: string;
    userId?: string;
    items: CartItem[];
    status: "idle" | "loading" | "error";
}

const initialState: CartState = {
    items: [],
    status: "idle",
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<CartItem>) {
            const existing = state.items.find(
                (item) => item.productId === action.payload.productId
            );

            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        changeQuantity(
            state,
            action: PayloadAction<{ productId: string, quantity: number }>
        ) {
            const item = state.items.find(
                (i) => i.productId === action.payload.productId
            );
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(
                (i) => i.productId !== action.payload
            );
        },
        clearCart(state) {
            state.items = [];
        },
        setCart(state, action: PayloadAction<CartState>) {
            state.id = action.payload.id;
            state.userId = action.payload.userId;
            state.items = action.payload.items || [];
        },
        setStatus(state, action: PayloadAction<CartState["status"]>) {
            state.status = action.payload;
        }
    }
});

export const { addItem, changeQuantity, removeItem, clearCart, setCart, setStatus } = cartSlice.actions;
export default cartSlice.reducer;