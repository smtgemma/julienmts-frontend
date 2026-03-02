import { UserProfile } from "@/interfaces/global";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
} = {
  user: null,
  token: null,
  refreshToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user; 
      state.refreshToken = action.payload.refreshToken;
      state.token = action.payload.token;
    },
    logoutFc: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logoutFc } = userSlice.actions;
export default userSlice.reducer;
