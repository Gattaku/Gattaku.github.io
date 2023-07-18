import React from 'react';
import { changePopNum,changeClickCnt, changeContinueMeasureFlg } from '../../Redux/features/ControllerSlice';
import { useDispatch, useSelector } from 'react-redux';
import Switch from '@mui/material/Switch';
import { deleteTempPoint } from '../../Redux/features/MeasurementDataSlice';



const Operater = () => {

  const dispatch = useDispatch();
  const {completed,imgSrc} = useSelector((state)=>state.initialSetting);
  const {popupNum,clickCnt, continueMeasureFlg} = useSelector((state)=> state.controller);


  const handleChange = (e) => {
    dispatch((changeContinueMeasureFlg(e.target.checked)));
    if (e.target.checked) {
      if (clickCnt) {
        dispatch(changeClickCnt());
        dispatch(deleteTempPoint());
      } 
      dispatch(changePopNum(3));
    } else {
      if (clickCnt) dispatch((changeClickCnt()));
      dispatch(changePopNum(0));
    }
  }


  const handleInitialClick = () => {
    if (!imgSrc) {
      window.alert("画像を貼り付けてください");
    } else {
      if (popupNum !== 0) return
      dispatch(changePopNum(1));
    }
    return;
  }
  const handleMeasureStart = () => {
    if (popupNum === 3) {
      if (clickCnt){
        dispatch(changeClickCnt());
        dispatch(deleteTempPoint());
      } 
      dispatch(changePopNum(0));
    } else {
      dispatch(changePopNum(3));
    }
    if (continueMeasureFlg) dispatch(changeContinueMeasureFlg(false));
  }

  return (
    <div className='operater-box'>
      <div className="operater-text initial-btn">
      <div className="toggle-btn-area">
        <div className="hover-comment">
        </div>
        <div className="toggle-btn">
        </div>
      </div>
        <div className='btn-title'>▼ボタンを選択</div>
      </div>
      <div className='initial-btn'>
        {
          completed ?
          <>
            <div className="toggle-btn-area hover-toggle-btn-area">
              <div className="hover-comment hover-show">
                <div>
                  連続測定を許可
                </div>
              </div>
              <div className="toggle-btn">
                <Switch 
                  checked={continueMeasureFlg}
                  onChange={handleChange}
                  color='primary'
                />
              </div>
            </div>
            <div className='btn-name'>
              <div>
                <button onClick={handleMeasureStart}
                  style={{
                    backgroundColor: popupNum === 3 ? 'black': "snow",
                    color: popupNum ===3 ? "white": "black",
                    transform:popupNum ===3 ?"translate(1.5px,1.5px)": "translate(0,0)",
                  }}
                >
                  測定開始</button>
              </div>
            </div>
          </>
          :
          <>
            <div className="hover-comment">
            </div>
            <div className="toggle-btn">
            </div>
            <div className='btn-name'>
              <button onClick={handleInitialClick}
                style={{
                  backgroundColor: popupNum === 1 ? 'black': "snow",
                  color: popupNum ===1 ? "white": "black",
                }}
              >
                初期設定</button>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default Operater