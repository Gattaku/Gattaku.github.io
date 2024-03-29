(()=>{//即時間数に入れる

const arg1 = {capture: false, once: false, passive: false};
const $can = document.getElementById('c1');
const $ctx = $can.getContext('2d');
const $doc = document;
const $clear = $doc.getElementsByClassName('allClear');
const $popUp = $doc.getElementsByClassName('hContent popUp');
const $initLabel = $doc.getElementsByClassName('initSettingLabel');
const $popLabel = $doc.getElementsByClassName('popUpLabel');
const $setDir = $doc.getElementsByClassName('selectDirect');
const $initVal = $doc.getElementById('initialValue');
const $SetButton = $doc.getElementsByClassName('buttonSettingContent');
const $MeasureTrriger = $doc.getElementsByClassName('MeasureTriger');
const $MeasureLabel = $doc.getElementsByClassName('MeasureLabel');
const $initSet =$doc.getElementsByClassName('initialSetting');
const $canLabel =$doc.getElementsByClassName('canvasLabel');
const $lineWidth = $doc.getElementById('lineWidthRange');
const $lineWidthValue = $doc.getElementById('linewidthId');
const $lineColor = $doc.getElementById('lineColorSelect');
const $resultColor = $doc.getElementById('resultColorSelect');
const $circleSize = $doc.getElementById('circleSizeRange');
const $circleSizeValue = $doc.getElementById('circleSizeId')
const $circleColor = $doc.getElementById('circleColor');
const $togglebutton = $doc.getElementsByClassName('toggle_input');

//クリックイベントの情報を残しておく関数
let clickCnt = 0; //クリックの回数をカウント（偶数回の時にcanvasへのdrawをする)
let positionInfo = []; //文字列として各測定点を格納する ("xStart yStart xEnd yEnd");
let initPositionInfo =[];


//*初期設定、測定トリガー用******************
const ACTIVATE_='is-active';
let measureTrriger = 0;
let measureDataLabelCnt = 0;
let initSetting = 0;
let initDirection='null';
let initValue;
let initPreventIndex = 0;
let lean = 0;
//*************************** */
//測定結果格納用//
const $measure = document.getElementsByClassName('MeasureLabel');
//*******************↑↑↑↑↑ */
//画像の情報を保管しておく変数↓↓↓↓↓
let judgeImg =0; // 0->まだ画像登録なし。1->すでに画像登録あり。
let img0 = null;
let img1 = null;
let files = null;
let file = null;
let reader = null;
let item = null;
let img1EventTarget = null;
//**************************↑↑↑↑↑*/
//****線を書くために必要な変数/定数↓↓↓↓↓ */
let ballRadius = 4;
let measureLineColor = "#ff0000"; //測定線のカラーを選択
let measurePointCircle = "#ff0000"; //測定点のカラーを選択
let lineWidth = 3; //線の太さ
let initMeasureLineColor = "#00fbff";
let initPointCircle = "#00fbff";
let resultColor = "#70fa00";
//初期値を表示する
$lineWidthValue.innerHTML = `${lineWidth}`;
$circleSizeValue.innerHTML = `${ballRadius}`;
//*******************************↑↑↑↑↑ */
//***測定結果を書くための変数/定数 */
let targetVal = 100;
let measurementCnt =0;
//********************************** */
//*****Canvasサイズを全体にするための定数 */
let canvasWidth = document.documentElement.clientWidth - 38;
let canvasHeight = document.documentElement.clientHeight - 10;
//************************************************************ */
//*****トグルボタン用 */
let toggleTrigger = false;
//************************************************************ */

//**********************canvasのサイズをwindowサイズに合わせる関数******************************
function fitCanvasSize() {
  // Canvas のサイズをクライアントサイズに合わせる
  canvasWidth = document.documentElement.clientWidth - 38;
  canvasHeight = document.documentElement.clientHeight - 10;
  $can.width = canvasWidth;
  $can.height = canvasHeight;
}  
fitCanvasSize();
window.onresize = fitCanvasSize;
//**************************************************************************************** */


//関数類;
//①ドラッグ＆ドロップで画像を貼り付ける関数
//②コピペで貼り付ける関数
//③キャンバス上をクリックした時の座標（x,y）を取得する関数
//④取得した座標をもとにキャンバス上に線と〇をうつ関数
//⑤測定データのラベルを作る関数
//⑥キャンセルボタンを作る
//⑦ポップアップdelete
//⑧測定結果を動かすための関数
//⑨キャンセルが実行されると配列の要素をからにする
//⑩初期設定のポップアップ
//⑪初期値を測定するポップアップ
//⑫係数を求めるための関数
//⑬線幅を変えるための関数
//⑭線色を変えるための関数

//************対象の画像をキャンバス上にセッティングする **************************/
//ドラッグ’ドロップのコード
const dragOverHandler = {
    handleEvent: (event) => {
      judge_img=0; //再貼り付けする際にカウンターを０に戻すための再定義
      event.dataTransfer.dropEffect = 'copy';
      event.preventDefault();
    }
  };  $can.addEventListener('dragover', dragOverHandler, arg1);        

  const dropHandler =(event)=> {
    files = event.dataTransfer.files;
    if (files.length === 1) {
      file = files[0];
      reader = new FileReader();
      reader.addEventListener('load', loadReaderHandler, arg1);
      reader.readAsDataURL(file);
    }
    event.preventDefault();    
  };  $can.addEventListener('drop',(arg1)=>{dropHandler(event);});

const drawCanvasHandler = {
    handleEvent: (event) => {
      if (judgeImg ===0){
        img0 = event.target;
        $ctx.drawImage(img0, 0, 0);
        $ctx.save();
        judgeImg=1; //命令の最後にジャッジカウントを１にして、再貼り付け可能にしておく
      } else if (judgeImg ===1){
        $ctx.drawImage(img0, 0, 0);
        $ctx.save();
      };   
      $canLabel[0].style.display = 'none'   
    }
};

const loadReaderHandler = {
    handleEvent: (event) => {
      if (judgeImg === 0){
        img1 = new Image();
        img1.addEventListener('load', drawCanvasHandler, arg1);
        img1EventTarget = img1.src = event.target.result;
      } else if (judgeImg === 1){
        img1.addEventListener('load', drawCanvasHandler,arg1);
        img1.src = img1EventTarget;
      };     
    }
};

//*********************コピペで画像を貼り付けるコード *******************
document.onpaste = function(pasteEvent) {
  judgeImg=0; //再貼り付けする際にカウンターを０に戻すための再定義
  item = pasteEvent.clipboardData.items[0];
  if (item.type.indexOf("image") === 0){
    file = item.getAsFile();
    reader = new FileReader();
    reader.addEventListener('load', loadReaderHandler, arg1);
    reader.readAsDataURL(file);
  }
}
//*******************************************************************
//********************************************************************************** */

//*③キャンバス上をクリックした時の座標（x,y）を取得する関数
/* @param {event} クリックした際のイベント全部取ってくる
   @return {str} クリック座標のx yを文字列として返却
 */
const makeCanCordinate = (event) => {
  const revice = event.target.getBoundingClientRect();//画面絶対座標に対するCanvas位置ずれを補正するための定数
  const x = event.clientX-revice.left;
  const y= event.clientY-revice.top;
  // const cordinate = [x,y];
  return `${x} ${y}`;
}

// ④取得した座標をもとにキャンバス上に線と〇をうつ関数
const canDraw = window.onload = (arrayData) => {
  switch (judgeImg){
    case 0:
      //何もしない
      break;
    case 1:
      img1.src = img1EventTarget;
      img1.onload = () => {
        $ctx.clearRect(0, 0,canvasWidth,canvasHeight);
        $ctx.drawImage(img0, 0, 0)
        let lineNum = arrayData.length;
        if (clickCnt % 2 !==0){
          lineNum += -1;
        }
        let lineColor ="";
        let circlePoint="";
        if (initSetting===1){
          lineColor=initMeasureLineColor;
          circlePoint=initPointCircle;
        } else {
          lineColor=measureLineColor;
          circlePoint=measurePointCircle;
        }
        
        for (let index = 0 ;index < lineNum ; index++){ //上から「①線を引く②開始点/終了点に点を設定③測定ラベルまでの直線を表現」
          if (arrayData[index] ==="") { //もしも情報が空なら何も操作をしない
            //何もしない
          } else { 
            const tempPosition = arrayData[index].trim().split(" ")
            if (lineWidth !== 0){
              $ctx.beginPath () ;
              $ctx.moveTo( parseInt(tempPosition[0])-ballRadius/2, parseInt(tempPosition[1])-ballRadius/2) ;
              $ctx.lineTo( parseInt(tempPosition[2]-ballRadius/2), parseInt(tempPosition[3])-ballRadius/2) ;
              $ctx.strokeStyle = lineColor ;
              $ctx.lineWidth = lineWidth ;
              $ctx.stroke();
            }
            if (initSetting !==1){
              $ctx.beginPath () ;
              $ctx.moveTo( (parseInt(tempPosition[0])+parseInt(tempPosition[2]))/2, (parseInt(tempPosition[1])+parseInt(tempPosition[3]))/2 ) ;
              switch (tempPosition.length){
                case 4:
                  $ctx.lineTo( (parseInt(tempPosition[0])+parseInt(tempPosition[2]))/2-30, (parseInt(tempPosition[1])+parseInt(tempPosition[3]))/2-60 ) ;
                  break;
                case 6:
                  $ctx.lineTo( parseInt(tempPosition[4]), (parseInt(tempPosition[5]))) ;
                  break;
                default:
                  break;
              }
              $ctx.strokeStyle = lineColor ;
              $ctx.lineWidth = Math.floor(lineWidth/5)+1 ;
              $ctx.stroke() ;
            }
                  
            $ctx.beginPath();
            $ctx.arc(parseInt(tempPosition[0])-ballRadius/2, parseInt(tempPosition[1])-ballRadius/2, ballRadius, 0, Math.PI*2);
            $ctx.arc(parseInt(tempPosition[2])-ballRadius/2, parseInt(tempPosition[3])-ballRadius/2, ballRadius, 0, Math.PI*2);
            $ctx.fillStyle = circlePoint;
            $ctx.fill();
            $ctx.closePath();
          }
        }
        if (clickCnt % 2 !== 0) { //もしも奇数回の場合は、開始点の情報だけ存在するため、その点を打つ
          const tempPosition = arrayData[lineNum].trim().split(" ")
          $ctx.beginPath();
          $ctx.arc(parseInt(tempPosition[0])-ballRadius/2, parseInt(tempPosition[1])-ballRadius/2, ballRadius, 0, Math.PI*2);
          $ctx.fillStyle = circlePoint;
          $ctx.fill();
          $ctx.closePath();
        }
        if (clickCnt % 2 ===0){
          initSetting = 0;
        }
      }

      break;
  }
}

//⑤測定データのラベルを作る関数
/* @param {str} その回のxStart, yStart, xEnd ,yEndをとってくる
   @return なし。測定ラベルを作る
 */
const measureDataSet = (str)=>{
  const tempInfo = str.trim().split(" ");
  const x = (parseInt(tempInfo[2])-parseInt(tempInfo[0]))/lean;
  const y = (parseInt(tempInfo[3])-parseInt(tempInfo[1]))/lean;
  const L = ((x**2+y**2)**(1/2)).toFixed(2);
  $measure[measurementCnt].style.display = 'block';
  $measure[measurementCnt].style.left = ((parseInt(tempInfo[2])+parseInt(tempInfo[0]))/2-30)+'px';
  $measure[measurementCnt].style.top =((parseInt(tempInfo[3])+parseInt(tempInfo[1]))/2-60)+'px';
  $measure[measurementCnt].innerText = 'x='+x.toFixed(2)+
                                        '\nY='+y.toFixed(2)+
                                        '\n直線='+L
  measureCancelLabelMake();
  //MeasureTrriger初期化と測定開始ボタンのis-activeを消す。
  measurementCnt++;
  measureDataLabelCnt++;
  if (toggleTrigger){
    console.log("トグルボタンはこっちを指してます。")
    // measureContent();
  } else {
    popUpdeleat();
    console.log("こっちはトグルボタンなんで通ってないよ")
    measureTrriger =0;
    $MeasureTrriger[0].classList.remove(ACTIVATE_);
  }
};

//⑥キャンセルボタンを作る
const measureCancelLabelMake = () => {
  let newCancelLabel = $measure[measureDataLabelCnt];
  let newCancelElement = document.createElement('button');
  console.log('キャンセルボタンを生成しました');
  newCancelElement.className = 'cancelTrriger';
  newCancelElement.textContent = '×';
  newCancelElement.dataset.cancelTrriger = measureDataLabelCnt;
  console.log(measureDataLabelCnt);
  console.log(measurementCnt);
  newCancelLabel.appendChild(newCancelElement);
  newCancelElement.addEventListener('click', (e)=>{
    const $this = e.target;
    cancelVal = $this.dataset.cancelTrriger;
    if (window.confirm('この測定点を削除しますか？')){
      cancelMeasurement(cancelVal);
      console.log('キャンセルします');
    } else {
      console.log('キャンセルしません！！！');
    }            
  });
}

//⑦ポップアップdelete
const popUpdeleat = () => {
  $popUp[0].style.display = 'none';
  if(initSetting===1){
    $popLabel[0].style.display = 'none';
  } else {
    $popLabel[1].style.display = 'none';
  }
}

//⑧測定結果を動かすための関数
const move =(e) =>{
  let rect = e.target.getBoundingClientRect() ;
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  // measureDataMove();
  $measure[targetVal].style.left = x+'px';
  $measure[targetVal].style.top = y+'px';
  let tempPosition = positionInfo[targetVal].trim().split(" ");
  positionInfo[targetVal] = `${tempPosition[0]} ${tempPosition[1]} ${tempPosition[2]} ${tempPosition[3]} ${x} ${y}`;
  canDraw(positionInfo);
};

//⑨キャンセルが実行されると配列の要素をからにする
const cancelMeasurement =(cancelVal)=>{
  positionInfo[cancelVal] = "";
  $measure[cancelVal].style.display = 'none';
  canDraw(positionInfo);
};

//⑩初期設定のポップアップ
const PopUpchange = (e)=>{
  const $this = e.target;
  SetVal = $this.dataset.setbutton;
  console.log('SetVal->',SetVal);
  // console.log('$set_dir[0]->',$set_dir[0]);
  if (parseInt(SetVal,10) ===0){
    if ($setDir[0].value === 'null'){
      window.alert('基準の方向を指定してください');
    } else if (parseInt($initVal.value,10) === 0){
      window.alert('基準寸法を入力してください');
    } else {
    initDirection=$setDir[0].value;
    initValue=$initVal.value;
    initMeasure();
    };  
  } else {
    initSetting =0;
    $popUp[0].style.display = 'none';
    $initSet[0].classList.remove(ACTIVATE_);
  };
};

//⑪初期値を測定するポップアップ
const initMeasure = () =>{
  $initLabel[0].style.display = 'none';
  $popLabel[0].style.display = 'block';
  initPreventIndex =0;
};

//⑫係数を求めるための関数
const checkLean = (array) => {
  let tempLetter = array[0];
  let tempArray = tempLetter.trim().split(" ");
  console.log(initDirection);
  if (initDirection ==="x"){
    lean = Math.abs(parseInt(tempArray[2])-parseInt(tempArray[0]))/initValue;
  } else if (initDirection==="y"){
    lean = Math.abs(parseInt(tempArray[3])-parseInt(tempArray[1]))/initValue;
  } else if (initDirection==="Length"){
    lean = ((parseInt(tempArray[2])-parseInt(tempArray[0]))**2+(parseInt(tempArray[3])-parseInt(tempArray[1]))**2)**(1/2)/initValue;
  }
  console.log(lean);
}

//⑬線幅を変えるための関数
$lineWidth.addEventListener('input', (e)=>{
  const lineWidthValue= e.target.value;
  $lineWidthValue.innerHTML = ` ${lineWidthValue}   `;
  lineWidth = lineWidthValue;
  canDraw(positionInfo);
})

//⑭線色を変えるための関数
$lineColor.addEventListener('change',(e)=>{
  const colorValue = e.target.value;
  measureLineColor = colorValue;
  canDraw(positionInfo);
})

//⑮結果ラベルの色を変えるための関数
$resultColor.addEventListener('change',(e)=>{
  const colorValue = e.target.value;
  resultColor = colorValue;
  console.log(resultColor);
  for (let i = 0; i < $MeasureLabel.length ;i++){
    $MeasureLabel[i].style.backgroundColor = resultColor;
  }
})

//⑯点の大きさを変えるための関数
$circleSize.addEventListener('input', (e)=>{
  const circleSize= e.target.value;
  $circleSizeValue.innerHTML = `${circleSize}`;
  ballRadius = circleSize;
  canDraw(positionInfo);
})

//⑰点の色を変えるための関数
$circleColor.addEventListener('change',(e)=>{
  const colorValue = e.target.value;
  measurePointCircle = colorValue;
  canDraw(positionInfo);
})
//⑱画面のリサイズ時に再度CanDrawを呼び出す
window.addEventListener('resize',()=>{
  fitCanvasSize();
  canDraw(positionInfo);
})

//⑲測定部分のトグルボタンの状態を監視する
$togglebutton[0].addEventListener('change',(event)=>{
  const tempvalue = event.target.checked;
  if (tempvalue){
    toggleTrigger = true;
  } else {
    toggleTrigger = false;
  }
  console.log(toggleTrigger);
})


//関数定義終わり******************************************************************************************************************:

//キャンバス上をクリックすると発生するイベント
$can.addEventListener('click', (e) => {
  switch (judgeImg){
    case 0:
      //何もしない
      break;
    case 1:
      switch (initSetting){
        case 1:
          clickCnt++;
          let tempPosi = makeCanCordinate (e);
          if (clickCnt % 2 ===0) {
            initPositionInfo[0] = `${initPositionInfo[0]} ${tempPosi}`;
            $initSet[0].classList.remove(ACTIVATE_);
            popUpdeleat();
            checkLean(initPositionInfo);
            // initSetting = 0;
            // measureDataSet(initPositionInfo[initPositionInfo.length-1]);
          } else {
            initPositionInfo[0]=tempPosi;
          }
          canDraw(initPositionInfo);
          
          console.log(initPositionInfo);
          break;
        case 0:
          switch (measureTrriger){
            case 0:
              //何もしない
              break;
            case 1:
              clickCnt++; //〇〇回目として情報を残しておく
              const position = makeCanCordinate (e);
              if (clickCnt % 2 ===0) {
                positionInfo[positionInfo.length-1] = `${positionInfo[positionInfo.length-1]} ${position}`;
                if (!toggleTrigger){
                  $MeasureTrriger[0].classList.remove(ACTIVATE_);
                  measureTrriger = 0;
                }
                measureDataSet(positionInfo[positionInfo.length-1]);
              } else {
                measureContent();
                positionInfo.push(position);
              }
              canDraw(positionInfo);
              console.log(positionInfo);
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
});

//測定ラベルがクリックされた際にイベント発生
const measureContent = ()=>{
  console.log("measureContentに飛んできてます")
  // $popUp[0].style.display = 'block';
  // $popLabel[1].style.display = 'block';
  let newLabel = document.getElementById('dnd');
  let newElement = document.createElement('label');
  newElement.className = 'MeasureLabel';
  newElement.style.backgroundColor = resultColor;
  newElement.innerText = '測定結果'+ measureDataLabelCnt+'\nX\nY\nL';
  newElement.dataset.measure = measureDataLabelCnt;
  newLabel.appendChild(newElement);
  newElement.addEventListener('mousedown', (e)=>{
    const $this = e.target;
    targetVal = $this.dataset.measure;
    $can.addEventListener('mousemove',move);
  });
  newElement.addEventListener('mouseup', ()=>{
    $can.removeEventListener('mousemove',move);
  });
}

const measureStart = (e) =>{
  if (lean ===0){
    window.alert("初期設定をしてください");
  } else {
    if (!toggleTrigger){
      if (!$MeasureTrriger[0].classList.contains(ACTIVATE_)){
        $MeasureTrriger[0].classList.add(ACTIVATE_);
        measureTrriger =1;
        $popUp[0].style.display = 'block';
        $popLabel[1].style.display = 'block';
        // measureContent();
      } else {
        $MeasureTrriger[0].classList.remove(ACTIVATE_);
        measureTrriger = 0;
      }
    } else {
      if (!$MeasureTrriger[0].classList.contains(ACTIVATE_)){
      $MeasureTrriger[0].classList.add(ACTIVATE_);
      measureTrriger =1;
      $popUp[0].style.display = 'block';
      $popLabel[1].style.display = 'block';
      // measureContent();
      } else {
      $MeasureTrriger[0].classList.remove(ACTIVATE_);
      measureTrriger = 0;
      popUpdeleat();
      }
    }
  }
}
$MeasureTrriger[0].addEventListener('click', measureStart);

$initSet[0].addEventListener('click', (e)=>{
  if (judgeImg===0){
    window.alert("画像を先に貼り付けてください");
  } else {
    $initSet[0].classList.add(ACTIVATE_);
    $popUp[0].style.display = 'block';
    $initLabel[0].style.display = 'block';
    initSetting =1;
    initPreventIndex =1;
    let cnt=0;
    while(cnt < $SetButton.length){
      $SetButton[cnt].addEventListener('click',(e)=>PopUpchange(e));
      cnt++;
    }  
  }
})

$clear[0].addEventListener('click', (e)=>{
  for (let i=0; i <positionInfo.length ; i++){
    positionInfo[i]="";
  }
  canDraw(positionInfo);
  for (const elm of $measure){
    elm.style.display = 'none';
  }
})


}) ();