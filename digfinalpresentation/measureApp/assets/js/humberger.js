(()=>{//即時関数に入れる
    const $doc = document;
    const $hum = $doc.getElementById('opneNav');
    const $wrap = $doc.getElementById('wrapper');
    const $nav = $doc.getElementById('nav');
    const $img = $doc.getElementById('settingImg');

    $hum.addEventListener('click',(e)=>{
        if ($wrap.classList.contains('show')){
            $wrap.classList.remove('show');
            $nav.classList.remove('show');
            $img.src= "./assets/image/setting.png"
        } else {
            $wrap.classList.add('show');
            $nav.classList.add('show');
            $img.src= "./assets/image/cancel.png"
        }
    })
}) ();