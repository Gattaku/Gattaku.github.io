import React from 'react';
import { changePopNum } from '../../Redux/features/ControllerSlice';
import { useDispatch, useSelector } from 'react-redux';



const Operater = () => {

  const dispatch = useDispatch();
  const {completed} = useSelector((state)=>state.initialSetting);
  const {imgSrc} = useSelector((state)=>state.initialSetting);



  const handleInitialClick = () => {
    if (!imgSrc) {
      window.alert("画像を貼り付けてください");
    } else {
      dispatch(changePopNum(1));
    }
    return;
  }
  const handleMeasureStart = () => {
    dispatch(changePopNum(3));
  }

  return (
    <div className='operater-box'>
      <div className="operater-text">
        <div>▼ボタンを選択</div>
      </div>
      <div className='initial-btn'>
        <div className="hover-comment">

        </div>
        <div className="toggle-btn">

        </div>
        {
          completed ?
          <div className='btn-name'>
            <button onClick={handleMeasureStart}>測定開始</button>
          </div>
          :
          <div className='btn-name'>
            <button onClick={handleInitialClick}>初期設定</button>
          </div>
        }
      </div>
    </div>
  )
}

export default Operater