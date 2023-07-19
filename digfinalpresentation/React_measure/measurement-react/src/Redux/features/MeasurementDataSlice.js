import { createSlice } from "@reduxjs/toolkit";
import { calculateLength, calculateMeasureLabel, calculateAngle, calculateAngleLabel } from "../../assets/controller/CalcuraterHandler";


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
        addTempPoint: (state, action) => {
            const [x, y] = action.payload;
            state.temp.lengthData[2] = x;
            state.temp.lengthData[3] = y;
        },
        addTempPoint2: (state, action) => {
            const [x, y] = action.payload;
            state.temp.lengthData[4] = x;
            state.temp.lengthData[5] = y;
        },
        addAngleSecondPoint: (state, action) => {
            state.temp.lengthData = action.payload;
        },
        addAngleThirdPoint: (state, action) => {
            const transedData = [...action.payload];
            const id = transedData.splice(0, 1);
            const category = transedData.splice(0, 1);
            const resultAngle = calculateAngle(transedData);
            const measureLabel = calculateAngleLabel(transedData);
            const addData = {
                id: id[0],
                category: category[0],
                lengthData: transedData,
                resultSelectFlg: false,
                resultData: resultAngle,
                measureLabel: measureLabel,
            }
            state.value.push(addData);
        },
        deleteTempPoint: (state) => {
            state.temp = {}
        },
        addSecondPoint: (state, action) => {
            const transedData = [...action.payload];
            const id = transedData.splice(0, 1);
            const category = transedData.splice(0, 1);
            const lean = transedData.splice(0, 1);
            const resultData = calculateLength(lean, transedData);
            const measureLabel = calculateMeasureLabel(transedData);
            const addData = {
                id: id[0],
                category: category[0],
                lengthData: transedData,
                resultSelectFlg: false,
                resultData: resultData,
                measureLabel: measureLabel,
            }
            state.value.push(addData);

        },
        setResultSelectFlg: (state, action) => {
            const index = action.payload;
            state.value[index].resultSelectFlg = true;
        },
        resetResultSelectFlg: (state, action) => {
            const index = action.payload;
            state.value[index].resultSelectFlg = false;
        },
        deleateData: (state, action) => {
            state.value = action.payload;
        },
        setOperateFlg: (state, action) => {
            const index = action.payload;
            state.value[index].measureLabel.operateIcon = true;
        },
        resetOperateFlg: (state, action) => {
            const index = action.payload;
            state.value[index].measureLabel.operateIcon = false;
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
        removeMoveFlg: (state) => {
            state.globalMove.globalMoveFlg = false;
            state.value.forEach((elm) => {
                elm.measureLabel.moveFlg = false;
            })
        },
        changeShowFlg: (state, action) => {
            const getData = [...action.payload];
            const index = getData.splice(0, 1);
            const item = getData.splice(0, 1);
            state.value[index].resultData[item].showFlg = getData[0];
        },



    },
})

export const {
    createNewData,
    addTempPoint,
    addTempPoint2,
    addAngleSecondPoint,
    addAngleThirdPoint,
    deleteTempPoint,
    addSecondPoint,
    setResultSelectFlg,
    resetResultSelectFlg,
    deleateData,
    setOperateFlg,
    resetOperateFlg,
    changeMoveFlg,
    moveLabel,
    resetMoveAction,
    removeMoveFlg,
    changeShowFlg
} = MeasurementDataSlice.actions;
export default MeasurementDataSlice.reducer;