import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeLanguage(state, action) {
      state.language = action.payload.language;
    },
    clearUser(state) {
      state.language = null;
    },
  },
});

export const {
  changeLanguage,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
