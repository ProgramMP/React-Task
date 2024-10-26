import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menu",
  initialState: { menu: false, modal: false },
  reducers: {
    showMenu(state) {
      state.menu = true;
    },
    hideMenu(state) {
      state.menu = false;
    },
    showModal(state) {
      state.modal = true;
    },
    hideModal(state) {
      state.modal = false;
    },
  },
});

export const menuActions = menuSlice.actions;

const store = configureStore({
  reducer: {
    menu: menuSlice.reducer,
  },
});

export default store;
