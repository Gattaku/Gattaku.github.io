import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./CSS/measureLabel.css";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Switch from '@mui/material/Switch';

import {changeResultSelectFlg,changeMoveFlg, moveLabel,changeShowFlg } from '../../Redux/features/MeasurementDataSlice';

import { deleateData } from '../../Redux/features/MeasurementDataSlice';
import { changePopNum } from '../../Redux/features/ControllerSlice';

const MeasureLabel = () => {


    const dispatch = useDispatch();

    const measureData = useSelector((state)=>state.measureData.value);
    const {settingPage} = useSelector((state)=> state.controller);
    const {labelFontSize,labelColor} = useSelector((state)=>state.initialSetting);

    const handleLabelCancel = (id) => {
        const tempMeasureData = measureData.filter((eachData)=>eachData.id !==id)
        dispatch(deleateData(tempMeasureData));
        dispatch(changePopNum(100));
    }

    const handleMouseDown = (id) => {
        if(settingPage) return
        const tempMeasureData = [...measureData];
        const index = tempMeasureData.findIndex((elm)=> elm.id === id);
        dispatch(changeMoveFlg([index,true]));
        dispatch(changePopNum(101));
    }

    const handleMouseUp = (id) => {
        if(settingPage) return
        const tempMeasureData = [...measureData];
        const index = tempMeasureData.findIndex((elm)=> elm.id === id);
        dispatch(changeMoveFlg([index,false]));
        dispatch(changePopNum(0));
    }

    const handleXResultChange = (e,id) => {
        const tempMeasureData = [...measureData];
        const index = tempMeasureData.findIndex((elm)=> elm.id === id);
        dispatch(changeShowFlg([index,0,e.target.checked])); //第2引数 0:x, 1:y, 2:Length
    }

    const handleYResultChange = (e,id) => {
        const tempMeasureData = [...measureData];
        const index = tempMeasureData.findIndex((elm)=> elm.id === id);
        dispatch(changeShowFlg([index,1,e.target.checked])); //第2引数 0:x, 1:y, 2:Length
    }

    const handleLengthResultChange = (e,id) => {
        const tempMeasureData = [...measureData];
        const index = tempMeasureData.findIndex((elm)=> elm.id === id);
        dispatch(changeShowFlg([index,2,e.target.checked])); //第2引数 0:x, 1:y, 2:Length
    }

    const handleChangeResultSelect = (id) => {
        const tempMeasureData = [...measureData];
        const index = tempMeasureData.findIndex((elm)=> elm.id === id);
        dispatch(changeResultSelectFlg(index));
    }



 
    if (measureData.length === 0) {
        return (
            <div>

            </div>
        )
    } else {
        return (               
            measureData.map((eachResult)=> {
            const id = eachResult.id;
            const resultSelectFlg = eachResult.resultSelectFlg;
            const labelPoint = eachResult.measureLabel.measurePosition;
            const measureResult = eachResult.resultData;
            const xFlg = measureResult[0].showFlg;
            const yFlg = measureResult[1].showFlg;
            const lengthFlg = measureResult[2].showFlg;
            const tempResultData = measureResult.filter((elm)=> elm.showFlg === true);  
            return (
                <div
                    className='label-container' 
                    key={id}
                    style={{
                        position:'absolute',
                        top:labelPoint[3],
                        left:labelPoint[2],
                        backgroundColor:labelColor,
                    }}
                >
                    <div 
                        className="result-show"
                        onMouseDown={()=>handleMouseDown(id)}
                        onMouseUp = {()=>handleMouseUp(id)}    
                    >
                        {
                            tempResultData.map((elm)=>{
                                return (
                                    <div key={elm.dataLabel}
                                     style = {{
                                        fontSize: `${labelFontSize}px`,
                                     }}
                                    >
                                        {`${elm.dataLabel}${elm.data}`}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="label-operator">
                        <div className="cancel-label">
                            <button onClick={()=>handleLabelCancel(id)}>
                                <DeleteForeverIcon className='deletebtn' />
                            </button>
                        </div>
                        <div className="detail-label">
                            <div>
                                <button onClick={()=>handleChangeResultSelect(id)} >
                                    {resultSelectFlg?                                    
                                    <KeyboardDoubleArrowLeftIcon className='continuebtn'/>:
                                    <KeyboardDoubleArrowRightIcon className='continuebtn'/>
                                    }
                                </button>
                            </div>
                            <div className="select-result"
                                style={{
                                    opacity:resultSelectFlg? "1":"0",
                                }}
                            >
                                <div className='xResult select-result-item'>
                                    <div>
                                        <Switch
                                            checked={xFlg}
                                            onChange={(e)=>handleXResultChange(e,id)}
                                        />
                                    </div>
                                    <div className='select-result-item-name'>
                                        <div>
                                            x
                                        </div>
                                    </div>
                                </div>
                                <div className="yResult select-result-item">
                                    <div>
                                        <Switch 
                                            checked={yFlg}
                                            onChange={(e)=>handleYResultChange(e,id)}
                                        />
                                    </div>
                                    <div className='select-result-item-name'>
                                        <div>
                                            y
                                        </div>
                                    </div>
                                </div>
                                <div className="lengthResult select-result-item">
                                    <div>
                                        <Switch 
                                            checked={lengthFlg}
                                            onChange={(e)=>handleLengthResultChange(e,id)}
                                        />
                                    </div>
                                    <div className='select-result-item-name'>
                                        <div>
                                            直線
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            })
        )
    }
}

export default MeasureLabel