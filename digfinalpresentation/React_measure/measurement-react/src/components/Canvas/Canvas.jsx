import React, { useEffect, useRef, useState } from 'react'
import { handleCanvasClick } from '../../assets/controller/ClickHandler';
import { calculateLean } from '../../assets/controller/ClickHandler';
import { changeLean,changeCordinate,checkCompleted } from '../../Redux/features/InitialSettingSlice';
import { changePopNum, changeClickCnt } from '../../Redux/features/ControllerSlice';
import { createNewData, addSecondPoint } from '../../Redux/features/MeasurementDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getImgSrc } from '../../Redux/features/InitialSettingSlice';
import { v4 as uuidv4 } from 'uuid';




const Canvas = (props) => {

  const dispatch = useDispatch();
  
  const {popupNum, clickCnt} = useSelector((state)=> state.controller);
  const {direction,baseLength,cordinate,imgSrc,measureColor,measureLineWidth,ballradius} = useSelector((state)=>state.initialSetting);
  const measureData = useSelector((state)=>state.measureData.value);
  
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
    if (!(popupNum===2 || popupNum ===3)) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const handleCanvasClickOnReact = (e) => {
      const canvasDraw = (arg) => {
        const image = new Image();
        image.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0);
          const temp = [...arg];
          console.log(temp);
          const newArray = [];
          while (temp.length > 2) {
            const tempRemoval = temp.splice(0,2);
            newArray.push(tempRemoval);
          }
          newArray.push(temp)
          for (const elm of newArray) {
            context.beginPath();
            context.arc(elm[0], elm[1], ballradius, 0, 2 * Math.PI); // 丸の半径を20としていますが、適宜調整してください
            context.fillStyle = measureColor; // 丸の塗りつぶし色を指定していますが、適宜変更してください
            context.fill();
            context.closePath();
          }

          for (let i = 0; i < Math.floor(newArray.length/2);i++) {
            context.beginPath () ;
            context.moveTo(newArray[i*2][0], newArray[i*2][1]);
            context.lineTo(newArray[i*2+1][0], newArray[i*2+1][1]);
            context.strokeStyle = measureColor ;
            context.lineWidth = measureLineWidth ;
            context.stroke();
          }
        };
      image.src = imgSrc; 
      }

      switch (popupNum) {

        case 0: //サイズや、カラーなどのセッティングを変えただけの時の処理。処理番号は０なので

          break;
        case 2: //初期設定時のクリックできるpopupNum
          const result = handleCanvasClick(e);
          if (!clickCnt) {
            dispatch(changeCordinate(result))
            dispatch(changeClickCnt());
            canvasDraw(result);
          } else {
            const temp = [...cordinate,...result];
            dispatch(changeCordinate(temp));
            const lean = calculateLean([direction,baseLength, ...temp]);
            dispatch(changeLean(lean));
            dispatch(changeClickCnt());
            dispatch(checkCompleted(true));
            dispatch(changePopNum(0));
            canvasDraw(temp);
          }
          break;
        case 3: //測定中の動作
          const resultNew = handleCanvasClick(e);
          if(!clickCnt) {
            const id =uuidv4();
            const transData = [id,...resultNew];
            dispatch(createNewData(transData));
            dispatch(changeClickCnt());
            const drawArray = [];
            if (measureData.length !==0) {
              for (const elm of measureData ) {
                drawArray.push(...elm.lengthData);
              }
            }
            drawArray.push(...resultNew);
            canvasDraw(drawArray);

          } else {
            const tempPoint = [...measureData[measureData.length-1].lengthData,...resultNew];
            dispatch(addSecondPoint(tempPoint));
            dispatch(changeClickCnt());
            dispatch(changePopNum(0));
            const drawArray = [];
            if (measureData.length !==0) {
              for (const elm of measureData ) {
                drawArray.push(...elm.lengthData);
              }
            }
            drawArray.push(...resultNew);
            canvasDraw(drawArray);
          }
          break;
        default:
          console.log("クリックできるタイミングではありません")
      }      
    };
    canvas.addEventListener('click', handleCanvasClickOnReact);
    return () => {
      canvas.removeEventListener('click', handleCanvasClickOnReact);
    };
  }, [imgSrc,popupNum,clickCnt, measureData,measureColor,measureLineWidth,ballradius]);

  return (
    <div className='canvas-area'>
      <canvas
        className='canvas-grid'
        id='c1'
        ref={canvasRef}
        width = {windowDimensions.innerWidth-5}
        height={windowDimensions.innerHeight-160}
      >

      </canvas>
    </div>
  )
}

export default Canvas