import { createSlice } from "@reduxjs/toolkit"

const initialState = { searchData: "" }

const searchSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.searchData = action.payload
    },
    removeSearch(state) {
      state.searchData = ""
    }
  }
})

export const { setSearch, removeSearch } = searchSlice.actions
export default searchSlice.reducer
