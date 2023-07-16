import React from 'react'
import "./CSS/setting.css"
import { useDispatch, useSelector } from 'react-redux';
import { changeLineWidth,changeLineColor,changeBallRadius,changeBallColor,changeLabelFontSize,changeLabelColor } from '../../Redux/features/InitialSettingSlice';
import { changePopNum } from '../../Redux/features/ControllerSlice';

const Setting = () => {

    const dispatch = useDispatch();


    const {settingPage} = useSelector((state)=> state.controller);
    const {measureLineWidth, measureColor,ballradius,ballColor,labelFontSize,labelColor} = useSelector((state)=> state.initialSetting);

    const hadleLineWidthChange = (e) => {
        dispatch(changeLineWidth(e.target.value));
        dispatch(changePopNum(100));
    }

    const hadleLineColorChange = (e) => {
        dispatch(changeLineColor(e.target.value));
        dispatch(changePopNum(100));
    }

    const hadleBallRadiusChange = (e) => {
        dispatch(changeBallRadius(e.target.value));
        dispatch(changePopNum(100));
    }

    const hadleBallColorChange = (e) => {
        dispatch(changeBallColor(e.target.value));
        dispatch(changePopNum(100));
    }

    const hadleLabelFontSizeChange = (e) => {
        dispatch(changeLabelFontSize(e.target.value));
        dispatch(changePopNum(100));
    }

    const hadleLabelColorChange = (e) => {
        dispatch(changeLabelColor(e.target.value));
        dispatch(changePopNum(100));
    }

  return (
   <nav className='setting-nav'
    style={{
        position:'fixed',
        right: settingPage? 0 :"-270px" ,
        top:0,
        width:"270px",
        height:"100%",
        backgroundColor: "#c3c3c3",
    }}
   >
    <div className="line-setting setting-box">
        <div className='title-settig-name'>線</div>    
        <div className="size-setting">           
            <div className="setting-text">
                サイズ
            </div>
            <div className="input-content">
                <input type="range" min="1" max="15" value={measureLineWidth}
                 onChange={(e)=>hadleLineWidthChange(e)}
                />
            </div>
        </div>
        <div className="color-setting">
            <div className="setting-text">
                色
            </div>
            <div className="input-content">
                <input type="color"  value={measureColor}
                 onChange={(e)=>hadleLineColorChange(e)}
                />
            </div>
        </div>
    </div>
    <div className="startEnd-setting setting-box">
        <div className='title-settig-name'>始点/終点</div>    
        <div className="size-setting">           
            <div className="setting-text">
                サイズ
            </div>
            <div className="input-content">
                <input type="range" min="0" max="15" value={ballradius}
                 onChange={(e)=>hadleBallRadiusChange(e)}
                />
            </div>
        </div>
        <div className="color-setting">
            <div className="setting-text">
                色
            </div>
            <div className="input-content">
                <input type="color"  value={ballColor}
                 onChange={(e)=>hadleBallColorChange(e)}
                />
            </div>
        </div>
    </div>
    <div className="label-setting setting-box">
        <div className='title-settig-name'>測定結果ラベル</div>    
        <div className="size-setting">           
            <div className="setting-text">
                文字サイズ
            </div>
            <div className="input-content">
                <input type="range" min="10" max="30" value={labelFontSize}
                 onChange={(e)=>hadleLabelFontSizeChange(e)}
                />
            </div>
        </div>
        <div className="color-setting">
            <div className="setting-text">
                色
            </div>
            <div className="input-content">
                <input type="color"  value={labelColor}
                 onChange={(e)=>hadleLabelColorChange(e)}
                />
            </div>
        </div>
    </div>
   </nav>
  )
}

export default Setting