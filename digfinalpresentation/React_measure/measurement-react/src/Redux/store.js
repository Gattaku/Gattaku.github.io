import { configureStore } from "@reduxjs/toolkit";
import ControllerReducer from "./features/ControllerSlice";
import InitialSettingReducer from "./features/InitialSettingSlice";
import MeasurementReducer from "./features/MeasurementDataSlice";

export const store = configureStore({
    reducer: {
        controller: ControllerReducer,
        initialSetting: InitialSettingReducer,
        measureData: MeasurementReducer,
    },
})