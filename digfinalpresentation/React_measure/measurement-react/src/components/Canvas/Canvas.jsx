import React, { useEffect, useRef, useState } from 'react'
import {handleCanvasClick, calculateLean,combineData,calculateMeasureLabel } from '../../assets/controller/CalcuraterHandler';
import { changeLean,changeCordinate,checkCompleted } from '../../Redux/features/InitialSettingSlice';
import { changePopNum, changeClickCnt} from '../../Redux/features/ControllerSlice';
import { createNewData,addTempPoint,deleteTempPoint, addSecondPoint, moveLabel,resetMoveAction, removeMoveFlg } from '../../Redux/features/MeasurementDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getImgSrc } from '../../Redux/features/InitialSettingSlice';
import { v4 as uuidv4 } from 'uuid';
import MeasureLabel from './MeasureLabel';
import InitMsg from './InitMsg';




const Canvas = (props) => {

  const dispatch = useDispatch();
  
  const {popupNum, clickCnt,continueMeasureFlg} = useSelector((state)=> state.controller);
  const {direction,baseLength,lean,cordinate,imgSrc,measureColor,measureLineWidth,ballradius,ballColor} = useSelector((state)=>state.initialSetting);
  const measureData = useSelector((state)=>state.measureData.value);
  const tempMeasure = useSelector((state)=> state.measureData.temp);
  const globalMoveFlg = useSelector((state)=> state.measureData.globalMove.globalMoveFlg);
  const id = useSelector((state)=> state.measureData.globalMove.moveId);
  
  const getWindowDimensions = () => {
    const {innerWidth, innerHeight} = window;
    return {
      innerWidth,
      innerHeight
    }
  }
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(()=>{
    const onResize = ()=> {
      setWindowDimensions(getWindowDimensions());
      dispatch(changePopNum(100));
    }
    window.addEventListener("resize",onResize);
    return ()=> window.removeEventListener("resize", onResize)
  },[]);
  const canvasRef = useRef(null);
  //「Drag & Drop」or コピペで画像を貼り付けるコード
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const handleDrop = (event) => {
      event.preventDefault();

      const file = event.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0);
        };
        image.src = readerEvent.target.result;
        dispatch(getImgSrc(image.src));
      };
      reader.readAsDataURL(file);
    };
    const handleDragOver = (event) => {
      event.preventDefault();
    };
    const handlePaste = (event) => {
      const item = event.clipboardData.items[0];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        const image = new Image();
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          image.onload = () => {
            canvas.width = image.width; /* キャンバスの幅を設定 */
            canvas.height = image.height; /* キャンバスの高さを設定 */
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
          };
          image.src = readerEvent.target.result;
          dispatch(getImgSrc(image.src));
        };

        reader.readAsDataURL(blob);
      }   
    };
    canvas.addEventListener('drop', handleDrop);
    canvas.addEventListener('dragover', handleDragOver);
    document.addEventListener('paste', handlePaste);

    return () => {
      canvas.removeEventListener('drop', handleDrop);
      canvas.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);
  //クリックした場所に点を打つ
  useEffect(() => {
    if (!(popupNum === 0 || popupNum===2 || popupNum ===3 || popupNum===100 || popupNum === 101)) return; //とある条件下しか受け付けない
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const canvasDraw = (arg) => {

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width; /* キャンバスの幅を設定 */
        canvas.height = image.height; /* キャンバスの高さを設定 */
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        const temp = [...arg[0]]; // 測定点の座標
        const temp2 = [...arg[1]]; //ラベルの座標
        //測定点を２個のデータごとに分ける
        const newArray = [];
        while (temp.length > 2) {
          const tempRemoval = temp.splice(0,2);
          newArray.push(tempRemoval);
        }
        newArray.push(temp)

        //ラベルデータを４個のデータごとに分ける。
        const labelArray = [];
        while (temp2.length > 4) {
          const tempRemoval = temp2.splice(0,4);
          labelArray.push(tempRemoval);
        }
        labelArray.push(temp2);

        //測定点に色塗り
        for (const elm of newArray) {
          context.beginPath();
          context.arc(elm[0], elm[1], ballradius, 0, 2 * Math.PI); // 丸の半径を20としていますが、適宜調整してください
          context.fillStyle = ballColor; // 丸の塗りつぶし色を指定していますが、適宜変更してください
          context.fill();
          context.closePath();
        }

        //測定点間を線で結ぶ
        for (let i = 0; i < Math.floor(newArray.length/2);i++) {
          context.beginPath () ;
          context.moveTo(newArray[i*2][0], newArray[i*2][1]);
          context.lineTo(newArray[i*2+1][0], newArray[i*2+1][1]);
          context.strokeStyle = measureColor ;
          context.lineWidth = measureLineWidth ;
          context.stroke();
        }

        //ラベルへ向かう線を作成
        for (const elm of labelArray) {
          context.beginPath () ;
          context.moveTo(elm[0],elm[1]);
          context.lineTo(elm[2],elm[3]);
          context.strokeStyle = measureColor ;
          context.lineWidth = Math.ceil(measureLineWidth/3) ;
          context.stroke();
        }
      };
    image.src = imgSrc;
    }

    // changePopupNum =100 ->どれかのラベルを削除したとき
    // changePopupNum =101 ->どれかのラベルを動かすしたとき

    if (popupNum===100 || popupNum ===101) {
      console.log("ここも通ってるよ")
      if (measureData.length === 0) return
      const [drawArray, labelPosi] = combineData(measureData);
      canvasDraw([drawArray,labelPosi]);
      if (popupNum===100){
        dispatch(changePopNum(0));
      }
    }

    //測定中の２点目をクリックする前に線を表示する
    if (popupNum === 3 && clickCnt) {
      const [drawArray, labelPosi] = combineData(measureData)
      drawArray.push(...tempMeasure.lengthData);
      canvasDraw([drawArray,labelPosi]);
    }

    //途中で測定ボタンをクリックでキャンセルした場合
    if (popupNum === 0) {
      const [drawArray, labelPosi] = combineData(measureData)
      canvasDraw([drawArray,labelPosi]);
    }

    const handleCanvasClickOnReact = (e) => {
      switch (popupNum) {

        case 0: //サイズや、カラーなどのセッティングを変えただけの時の処理。処理番号は０なので
          if(globalMoveFlg){
            const newData = [...measureData];
            newData.forEach((elm)=> {
              elm.measureLabel.moveFlg = false;
            });
            dispatch(resetMoveAction(newData));
          }
          break;
        case 2: //初期設定時のクリックできるpopupNum
          const result = handleCanvasClick(e);
          if (!clickCnt) {
            dispatch(changeCordinate(result))
            dispatch(changeClickCnt());
            canvasDraw([result,[]]);
          } else {
            const temp = [...cordinate,...result];
            dispatch(changeCordinate(temp));
            const lean = calculateLean([direction,baseLength, ...temp]);
            dispatch(changeLean(lean));
            dispatch(changeClickCnt());
            dispatch(checkCompleted(true));
            dispatch(changePopNum(0));
            canvasDraw([temp,[]]);
          }
          break;
        case 3: //測定中の動作
          const resultNew = handleCanvasClick(e);
          if(!clickCnt) {
            const id =uuidv4();
            const transData = [id,...resultNew];
            dispatch(createNewData(transData));
            dispatch(changeClickCnt());
            const [drawArray, labelPosi] = combineData(measureData);
            drawArray.push(...resultNew);
            canvasDraw([drawArray,labelPosi]);

          } else {
            // const tempPoint = [...tempMeasure.lengthData,...resultNew]
            const tempPoint = [tempMeasure.lengthData[0],tempMeasure.lengthData[1],...resultNew]
            const transData = [...tempMeasure.id,lean,...tempPoint];
            dispatch(addSecondPoint(transData));
            dispatch(changeClickCnt());
            if (!continueMeasureFlg) {
              dispatch(changePopNum(0));
            }
            const [drawArray, labelPosi] = combineData(measureData)
            drawArray.push(...tempPoint);
            labelPosi.push(...calculateMeasureLabel(tempPoint).measurePosition);
            canvasDraw([drawArray,labelPosi]);            
          }
          break;
        default:
          console.log("クリックできるタイミングではありません");
          break;
      }
    };
    if (popupNum ===2 || popupNum === 3) {
      canvas.addEventListener('click',handleCanvasClickOnReact);
    }

    return () => {
      canvas.removeEventListener('click', handleCanvasClickOnReact);
    };
  }, [imgSrc,popupNum,clickCnt,direction,lean, measureData,tempMeasure,measureColor,measureLineWidth,ballradius,windowDimensions]);

  const handleMouseMove = (e,id)=> {

    //Label移動の際
    if (globalMoveFlg) {
      const tempMeasureData = [...measureData];
      const index = tempMeasureData.findIndex((elm)=> elm.id === id);
      dispatch(moveLabel([index,e.clientX-30,e.clientY-180]));
    }

    //２回目の点の際
    if (popupNum === 3 && clickCnt) {
      const [x,y] = handleCanvasClick(e);
      dispatch(addTempPoint([x,y]));
    }
  }

  const handleNothing = () => {

  }


  const handleKeyDown = (e) => {
    if (globalMoveFlg) { //globalMoveFlgが外せなかった場合の対応
      if (e.key === "Escape") {
        dispatch(removeMoveFlg());
      }
    }
    // if (popupNum === 3) {
    //   console.log("ここ通ってます2")
    //   if (e.key === "Escape") {
    //     console.log(clickCnt);
    //     if (clickCnt){
    //       console.log("ここ通ってます")
    //       dispatch(changeClickCnt());
    //       dispatch(deleteTempPoint());
    //     } 
    //     dispatch(changePopNum(0));
    //   }
    // }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)
  }, [globalMoveFlg])


  return (
    <div className='canvas-area'>
      <canvas
        className='canvas-grid'
        ref={canvasRef}
        width = {windowDimensions.innerWidth-5}
        height={windowDimensions.innerHeight-160}
        onMouseMove= {(globalMoveFlg || (popupNum === 3 && clickCnt)) ?(e)=> handleMouseMove(e,id) : handleNothing}
      >
      </canvas>
      <MeasureLabel />
      <InitMsg />
    </div>
  )
}

export default Canvas