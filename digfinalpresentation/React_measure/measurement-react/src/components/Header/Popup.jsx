import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changePopNum } from '../../Redux/features/ControllerSlice';
import { changedirection } from '../../Redux/features/InitialSettingSlice';
import { changeBaseLength } from '../../Redux/features/InitialSettingSlice';

const Popup = () => {

    const dispatch = useDispatch();
    const popupNum = useSelector((state)=>state.controller.popupNum);
    const initialSet = useSelector((state)=> state.initialSetting);


    const [direction,SetDirection] = useState("null");
    const [baseLength, setBaseLength] = useState(0);

    const handleChangeDirection = (e) => {
        SetDirection(e.target.value);
    }

    const handleChange = (e) => {
        setBaseLength(e.target.value)
    }

    const handleOKClick = () => {
        if (direction === "null") return window.alert("方向を指定してください")
        if (baseLength===0) return window.alert("基準寸法を入力してください");
        dispatch(changePopNum(2));
        dispatch(changedirection(direction));
        dispatch(changeBaseLength(baseLength));
    }

    const handleCancelClick = () => {
        dispatch(changePopNum(0));
    }


    if (popupNum===0) {
        return (
            <div>

            </div>
        )
    } else if (popupNum===1) {
        return (
          <div> 
                  <div >
                      <div>
                          <div className="popUpText">◆方向を指定してください</div>
                              <select className="selectDirect" id="" onChange={handleChangeDirection}>
                                  <option value="null">未選択</option>
                                  <option value="x">X方向</option>
                                  <option value="y">Y方向</option>
                                  <option value="Length">２点間</option>
                              </select>
                          </div>
                      <div>
                      <div className="popUpText">◆基準寸法を入力ください</div>
                      <input type="number" value={baseLength} id="initialValue" onChange={handleChange}/>
                      <label >[mm]</label>
                  </div>
                  <div className="buttonSetting">
                      <button className="buttonSettingContent" data-setbutton="0" onClick={handleOKClick}>OK</button>
                      <button className="buttonSettingContent" data-setbutton="1" onClick={handleCancelClick}>Cancel</button>
                  </div>
                  </div>
          </div>
        )
    } else if (popupNum===2) {
        return (
            <div className="popupTextArea">
                <div className="popUpLabel">基準となる２点をクリックしてください</div>
            </div>
        )
    } else if (popupNum===3) {
        return (
            <div className="popupTextArea">
                <div className="popUpLabel">測定したい２点をクリックしてください</div>
            </div>
        )
    } else if (popupNum===4) {
        return (
            <div className="popupTextArea">
                <div className="popUpLabel">測定したい３点をクリックしてください</div>
            </div>
        )
    }

}

export default Popup