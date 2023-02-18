// 'use strict'

(()=>{

    //**ページ送りのためのコード**********************************
    const numPage =5; //Totalページ数を指定する必要あり
    const images = [];
    for (let i = 0; i < numPage ; i++){
        images.push(`explanation/image/slide_master/スライド${i+1}.JPG`);
    }
    let current = 0;
    
    function changeImage(num) {
        if(current + num >= 0 && current + num < images.length) {
            current += num;
            document.getElementById('main_image').src = images[current];
            pageNum();
        }
    };
    function pageNum() {
        document.getElementById('page').textContent = `${current +1}/${images.length}`;
    }
    pageNum();
    document.getElementById('prev').onclick = function() {
        changeImage(-1);
    };
    document.getElementById('next').onclick = function() {
        changeImage(1);
    };
    //***************************************************** */

    //***タイムマネージャー用*************************************************
    const timeLimit = 170;
    const oldTime = Date.now();
    const $timeManager =document.getElementById('timeManager');
    const minLimit = Math.floor(timeLimit/60);
    const secLimit = timeLimit - 60*minLimit;
    const secLimitLetter = String(secLimit).padStart(2,"0");
    $timeManager.innerHTML = `残  ${minLimit} : ${secLimitLetter} `;
    setInterval(()=>{
        const currentTime = Date.now();
        const diff = currentTime-oldTime;

        const secTot = timeLimit - Math.floor(diff/1000);
        if (secTot < 60){
            $timeManager.style.color = "red";
            $timeManager.style.fontWeight="bold";
        }
        if (secTot <=0){
            $timeManager.innerHTML = `終了時間です`
        } else {
            const min = Math.floor(secTot/60);
            const sec = secTot - min*60;
            const secLetter = String(sec).padStart(2, '0');
            $timeManager.innerHTML = `残  ${min} : ${secLetter} `;
        }
    },1000)
    //******************************************************************** */



}) ();