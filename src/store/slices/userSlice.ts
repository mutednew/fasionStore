import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role?: "ADMIN" | "CUSTOMER";
}

interface UserState {
    profile: UserProfile | null;
    status: "idle" | "loading" | "error";
}

const initialState: UserState = {
    profile: null,
    status: "idle",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<UserProfile | null>) {
            state.profile = action.payload;
        },
        setStatus(state, action: PayloadAction<UserState["status"]>) {
            state.status = action.payload;
        },
        logout(state) {
            state.profile = null;
            state.status = "idle";
        },
    },
});

export const { setProfile, setStatus, logout } = userSlice.actions;
export default userSlice.reducer;