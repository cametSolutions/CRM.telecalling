import { configureStore } from "@reduxjs/toolkit"
import searchSlice from "../slices/search.js"
export const store=configureStore({
  reducer: {
    searchSlice
  }
})
