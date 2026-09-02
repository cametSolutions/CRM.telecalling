
// import { createSlice } from "@reduxjs/toolkit";
// import { getLocalStorageItem } from "../src/helper/localstorage";

// const storedCompany = getLocalStorageItem("selectedCompany");
// const storedBranch = getLocalStorageItem("selectedBranch");
// console.log(storedBranch)

// // Retrieve later with proper typing
// const companybranches = getLocalStorageItem("companybranches");
// const loggeduserbranches = getLocalStorageItem("loggeduserbranches")
// const loggeduserBranchOptions = getLocalStorageItem("loggeduserBranchOptions")
// console.log(loggeduserbranches)

// const initialState = {
//     selectedCompany: storedCompany ? storedCompany : null,
//     selectedBranch: storedBranch ? storedBranch : null,
//     branches: companybranches ? companybranches : [],
//     loggeduserbranches: loggeduserbranches ? loggeduserbranches : [],
//     userbranchOptions: loggeduserBranchOptions ? loggeduserBranchOptions : []
// };

// const companyBranchSlice = createSlice({
//     name: "CompanyBranch",
//     initialState,
//     reducers: {
//         selectedCompany(state, action) {
//             state.selectedCompany = action.payload;
//         },
//         setsliceselectedBranch(state, action) {
//             state.selectedBranch = action.payload;
//         },
//         setBranches(state, action) {
//             state.branches = action.payload;
//         },
//         setloggeduserBranchOptions(state, action) {
//             state.userbranchOptions = action.payload
//         },
//         loggeduserBranches(state, action) {
//             state.loggeduserbranches = action.payload
//         },
//         resetSelection(state) {
//             state.selectedCompany = null;
//             state.selectedBranch = null;
//         }
//     }
// });

// export const { selectedCompany, setsliceselectedBranch, setBranches, resetSelection, loggeduserBranches, setloggeduserBranchOptions } =
//     companyBranchSlice.actions;

// export default companyBranchSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorageItem } from "../src/helper/localstorage";

const initialState = {
  selectedCompany: getLocalStorageItem("selectedCompany") || null,
  selectedBranch: getLocalStorageItem("selectedBranch") || null,
  branches: getLocalStorageItem("companybranches") || [],
  loggeduserbranches: getLocalStorageItem("loggeduserbranches") || [],
  userbranchOptions: getLocalStorageItem("loggeduserBranchOptions") || []
};

const companyBranchSlice = createSlice({
  name: "CompanyBranch",
  initialState,
  reducers: {
    selectedCompany(state, action) {
      state.selectedCompany = action.payload;
    },

    setsliceselectedBranch(state, action) {
      state.selectedBranch = action.payload;
    },

    setBranches(state, action) {
      state.branches = action.payload;
    },

    loggeduserBranches(state, action) {
      state.loggeduserbranches = action.payload;
    },

    setloggeduserBranchOptions(state, action) {
      state.userbranchOptions = action.payload;
    },

    resetSelection(state) {
      state.selectedCompany = null;
      state.selectedBranch = null;
      state.branches = [];
      state.loggeduserbranches = [];
      state.userbranchOptions = [];
    }
  }
});

export const {
  selectedCompany,
  setsliceselectedBranch,
  setBranches,
  loggeduserBranches,
  setloggeduserBranchOptions,
  resetSelection
} = companyBranchSlice.actions;

export default companyBranchSlice.reducer;
