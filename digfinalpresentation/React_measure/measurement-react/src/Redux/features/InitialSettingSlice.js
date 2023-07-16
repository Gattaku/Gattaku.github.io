import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    direction: "null",
    baseLength: 0,
    lean: 0,
    cordinate: [],
    imgSrc: null,
    completed: false,
    measureColor: "#ff0000",
    measureLineWidth: 3,
    ballradius: 4,
    ballColor: "#ff0000",
    labelFontSize: 16,
    labelColor: "#70fa00",
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
        },
        changeLineWidth: (state, action) => {
            state.measureLineWidth = action.payload;
        },
        changeLineColor: (state, action) => {
            state.measureColor = action.payload;
        },
        changeBallRadius: (state, action) => {
            state.ballradius = action.payload;
        },
        changeBallColor: (state, action) => {
            state.ballColor = action.payload;
        },
        changeLabelFontSize: (state, action) => {
            state.labelFontSize = action.payload;
        },
        changeLabelColor: (state, action) => {
            state.labelColor = action.payload;
        },
    },
})

export const {
    changedirection,
    changeBaseLength,
    changeLean,
    changeCordinate,
    getImgSrc,
    checkCompleted,
    changeLineWidth,
    changeLineColor,
    changeBallRadius,
    changeBallColor,
    changeLabelFontSize,
    changeLabelColor,
} = InitialSettingSlice.actions;
export default InitialSettingSlice.reducer;