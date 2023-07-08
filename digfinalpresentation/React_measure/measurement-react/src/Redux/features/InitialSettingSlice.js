import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    direction: "null",
    baseLength: 0,
    lean: 0,
    cordinate: [],
    imgSrc: null,
    completed: false,
    measureColor: "#ff0000",
    measureLineWidth: 8,
    ballradius: 20,
}

export const InitialSettingSlice = createSlice({
    name: "initialSetting",
    initialState,
    reducers: {
        changedirection: (state, action) => {
            state.direction = action.payload;
        },
        changeBaseLength: (state, action) => {
            state.baseLength = action.payload;
        },
        changeLean: (state, action) => {
            state.lean = action.payload;
        },
        changeCordinate: (state, action) => {
            state.cordinate = action.payload;
        },
        getImgSrc: (state, action) => {
            state.imgSrc = action.payload;
        },
        checkCompleted: (state, action) => {
            state.completed = action.payload;
        }
    },
})

export const { changedirection, changeBaseLength, changeLean, changeCordinate, getImgSrc, checkCompleted } = InitialSettingSlice.actions;
export default InitialSettingSlice.reducer;