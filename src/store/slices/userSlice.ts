import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role?: "ADMIN" | "CUSTOMER";
}

interface UserState {
    token: string | null;
    profile: UserProfile | null;
    status: "idle" | "loading" | "error";
}

const initialState: UserState = {
    token: null,
    profile: null,
    status: "idle",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
        },
        setProfile(state, action: PayloadAction<UserProfile | null>) {
            state.profile = action.payload;
        },
        setStatus(state, action: PayloadAction<UserState["status"]>) {
            state.status = action.payload;
        },
        logout(state) {
            state.token = null;
            state.profile = null;
            state.status = "idle";
        },
    },
});

export const { setToken, setProfile, setStatus, logout } = userSlice.actions;
export default userSlice.reducer;