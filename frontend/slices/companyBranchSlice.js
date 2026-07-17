
import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorageItem } from "../src/helper/localstorage";

const storedCompany = getLocalStorageItem("selectedCompany");
const storedBranch = getLocalStorageItem("selectedBranch");
console.log(storedBranch)

// Retrieve later with proper typing
const companybranches = getLocalStorageItem("companybranches");
const loggeduserbranches = getLocalStorageItem("loggeduserbranches")
console.log(loggeduserbranches)

const initialState = {
    selectedCompany: storedCompany ? storedCompany : null,
    selectedBranch: storedBranch ? storedBranch : null,
    branches: companybranches ? companybranches : [],
    loggeduserbranches: loggeduserbranches ? loggeduserbranches : []
};

const companyBranchSlice = createSlice({
    name: "CompanyBranch",
    initialState,
    reducers: {
        selectedCompany(state, action) {
            state.selectedCompany = action.payload;
        },
        selectedBranch(state, action) {
            state.selectedBranch = action.payload;
        },
        setBranches(state, action) {
            state.branches = action.payload;
        },
        loggeduserBranches(state, action) {
            state.loggeduserbranches = action.payload
        },
        resetSelection(state) {
            state.selectedCompany = null;
            state.selectedBranch = null;
        }
    }
});

export const { selectedCompany, selectedBranch, setBranches, resetSelection,loggeduserBranches } =
    companyBranchSlice.actions;

export default companyBranchSlice.reducer;
