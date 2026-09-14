import { configureStore } from "@reduxjs/toolkit"
import searchSlice from "../slices/search.js"
import companyBranchReducer from "../../frontend/slices/companyBranchSlice.js";
import authReducer from "../../frontend/slices/authSlice.js"

export const store = configureStore({
  reducer: {
    search: searchSlice,
auth:authReducer,
    companyBranch: companyBranchReducer,
  },
})
