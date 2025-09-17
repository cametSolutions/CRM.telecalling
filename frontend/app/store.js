import { configureStore } from "@reduxjs/toolkit"
import searchSlice from "../slices/search.js"
import companyBranchReducer from "../../frontend/slices/companyBranchSlice.js";
export const store = configureStore({
  reducer: {
    search: searchSlice,
    companyBranch: companyBranchReducer,
  },
})
