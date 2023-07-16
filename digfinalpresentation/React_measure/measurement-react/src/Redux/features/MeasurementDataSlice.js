import { createSlice } from "@reduxjs/toolkit";
import { calculateLength, calculateMeasureLabel } from "../../assets/controller/CalcuraterHandler";


const initialState = {
    value: [],
    temp: {},
    // {id: uuidv4, lengthData: [x1,y1,x2,y2], movementData: [x3,y3]} <- data-content
    globalMove: {
        globalMoveFlg: false,
        moveId: "",
    }
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
            state.temp = setObject;
        },
        addSecondPoint: (state, action) => {
            const transedData = [...action.payload];
            const id = transedData.splice(0, 1);
            const lean = transedData.splice(0, 1);
            const resultData = calculateLength(lean, transedData);
            const measureLabel = calculateMeasureLabel(transedData);
            const addData = {
                id: id[0],
                lengthData: transedData,
                resultSelectFlg: false,
                resultData: resultData,
                measureLabel: measureLabel,
            }
            state.value.push(addData);

        },
        changeResultSelectFlg: (state, action) => {
            const index = action.payload;
            state.value[index].resultSelectFlg = !state.value[index].resultSelectFlg;
        },
        deleateData: (state, action) => {
            state.value = action.payload;
        },
        changeMoveFlg: (state, action) => {
            const getData = [...action.payload];
            const index = getData.slice(0, 1);
            state.value[index].measureLabel.moveFlg = getData[0];
            state.globalMove.globalMoveFlg = !state.globalMove.globalMoveFlg;
            state.globalMove.moveId = state.value[index].id;
        },
        moveLabel: (state, action) => {
            const getData = [...action.payload];
            const index = getData.splice(0, 1);
            state.value[index].measureLabel.measurePosition[2] = getData[0];
            state.value[index].measureLabel.measurePosition[3] = getData[1];
        },
        resetMoveAction: (state, action) => {
            state.value = action.payload;
            state.globalMove.globalMoveFlg = false;
        },
        changeShowFlg: (state, action) => {
            const getData = [...action.payload];
            const index = getData.splice(0, 1);
            const item = getData.splice(0, 1);
            state.value[index].resultData[item].showFlg = getData[0];
        }

    },
})

export const { createNewData, addSecondPoint, changeResultSelectFlg, deleateData, changeMoveFlg, moveLabel, resetMoveAction, changeShowFlg } = MeasurementDataSlice.actions;
export default MeasurementDataSlice.reducer;