import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    popupNum: 0, //←後々、初期設定ボタンを置いたら、初期値は０で良い 
    // 0:何も表示しない、1:初期設定の選択画面2:初期設定のクリック画面, 3: 寸法測定のクリック画面,100: delete中, 101:動かしてるとき
    clickCnt: false, //<- false =奇数回, true = 偶数回
    settingPage: false,
    continueMeasureFlg: false,
}

export const ControllerSlice = createSlice({
    name: "controller",
    initialState,
    reducers: {
        changePopNum: (state, action) => {
            state.popupNum = action.payload;
        },
        changeClickCnt: (state) => {
            state.clickCnt = !state.clickCnt;
        },
        changeSetting: (state) => {
            state.settingPage = !state.settingPage;
        },
        changeContinueMeasureFlg: (state, action) => {
            state.continueMeasureFlg = action.payload;
        },


    },
})

export const { changePopNum, changeClickCnt, changeSetting, changeContinueMeasureFlg } = ControllerSlice.actions;
export default ControllerSlice.reducer;