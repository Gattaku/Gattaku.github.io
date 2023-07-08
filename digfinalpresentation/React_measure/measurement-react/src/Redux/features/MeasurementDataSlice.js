import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
    // {id: uuidv4, lengthData: [x1,y1,x2,y2], movementData: [x3,y3]} <- data-content
}

export const MeasurementDataSlice = createSlice({
    name: "measureData",
    initialState,
    reducers: {
        createNewData: (state, action) => {
            const newData = action.payload;
            const id = newData.splice(0, 1);
            const setObject = {
                id: id,
                lengthData: newData,
            }
            state.value.push(setObject);
        },
        addSecondPoint: (state, action) => {
            state.value[state.value.length - 1].lengthData = action.payload;
        },

    },
})

export const { createNewData, addSecondPoint } = MeasurementDataSlice.actions;
export default MeasurementDataSlice.reducer;