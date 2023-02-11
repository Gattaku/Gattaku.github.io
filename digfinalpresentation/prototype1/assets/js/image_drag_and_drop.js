

//即時関数の中に入れる　（グローバル汚染対策)
(()=>{

	//変数の定義
	const $doc = document;
	const $preview = $doc.getElementById("preview");
	const $init_val = $doc.getElementById("initial_value");
	const select_opt = document.getElementById('init_dir');
	const target = document.getElementById('image');
	const $select_tab = $doc.getElementsByClassName("select-tab");
	const tabLen = $select_tab.length;
	const $tab_data = $doc.querySelectorAll('[data-tabno]');
	const ACTIVATE_ = 'is-active'
	const $lean = $doc.getElementsByClassName('value');
	const $set_dir = $doc.getElementsByClassName('init_setting_dir');
	const $point_s = $doc.getElementsByClassName("start");
	const $point_e = $doc.getElementsByClassName("end");
	const $axis = $doc.getElementsByClassName('axis-img');

	let measure_index = 10;
	let cnt=0; //start-endを見分けるカウント数
	let x_start=0;
	let y_start=0;
	let x_end =0;
	let y_end=0;
	let x_dif = 0;
	let y_dif = 0;
	let x_y_length = 0;
	let lean =0;

	//*************ドラッグ＆ドロップして画像を反映するコード*************
	
	target.addEventListener('dragover', function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = 'copy';
	});
	target.addEventListener('drop', function (e) {
		e.stopPropagation();
		e.preventDefault();
		const reader = new FileReader();
		reader.onload = function (e) {
			$preview.src = e.target.result;
		}
		reader.readAsDataURL(e.dataTransfer.files[0]);
		$axis[0].style.display = 'block';
	});
	//*************************************************************
	//ドラッグ＆ドロップのソース終わり

	//***********座標計算をするために関数************************************************************** */
	const handleClick = (e)=>{
		// e.preventDefault();
		let index =0; //どのチェックボックスが反映されているかを見る
		while(index <tabLen){
			if($tab_data[index].classList.length ===2){
				measure_index = index;
			}
			index++;
		}
		if(measure_index ===10){
			window.alert('初期設定or測定点を選択してください');
			return;
		}

		if(cnt === 0  && measure_index ===0 ){ //cntが０の時は、start地点を表し、1の時は終了地点を表す
			x_start = event.clientX;
			y_start = event.clientY;
			$point_s[measure_index].style.display = 'block';
			$point_s[measure_index].style.position = 'absolute';
			$point_s[measure_index].style.left = x_start-10+'px';
			$point_s[measure_index].style.top = y_start-10+'px';
			cnt++;
		}else if(cnt !==0 && measure_index ===0){
			x_end = event.clientX;
			y_end = event.clientY;
			cnt=0;
			$point_e[measure_index].style.display = 'block';
			$point_e[measure_index].style.position = 'absolute';
			$point_e[measure_index].style.left = x_end-10+'px';
			$point_e[measure_index].style.top = y_end-10+'px';
			x_dif = x_end-x_start;
			y_dif = y_end-y_start;
			x_y_length = (x_dif**2+y_dif**2)**(1/2);
			if($set_dir[0].value === 'X方向'){
				lean = ($init_val.value/x_dif);
			}else if($set_dir[0].value === 'Y方向'){
				lean = ($init_val.value/y_dif);
			}else {
				lean = ($init_val.value/x_y_length);
			}
			$lean[0].textContent = lean;
			let index = 0;
			while(index < tabLen){
			$tab_data[index].classList.remove(ACTIVATE_);
			index++;
			};
			docObj = activeDocument;
			pObj = docObj.pathItems.add();
			pObj.setEntirePath([[x_start,y_start],[x_end,y_end]]);
			pObj.filled = false; //　塗りなし
			pObj.stroked = true; //　線あり
			pObj.strokeWidth = 20; //　線幅10ポイント
			pObj.strokeColor = redColor; //　線の色を指定（赤色）
			measure_index =10;
		}else if(cnt ===0 && measure_index !==0){
			if($lean[0].textContent === '未取得'){
				window.alert('初期設定をしてください');
				return;
			}
			x_start = event.clientX;
			y_start = event.clientY;
			$point_s[measure_index].style.display = 'block';
			$point_s[measure_index].style.position = 'absolute';
			$point_s[measure_index].style.left = x_start-10+'px';
			$point_s[measure_index].style.top = y_start-10+'px';
			cnt++;
		}else if(cnt !==0 && measure_index !==0){
			x_end = event.clientX;
			y_end = event.clientY;
			$point_e[measure_index].style.display = 'block';
			$point_e[measure_index].style.position = 'absolute';
			$point_e[measure_index].style.left = x_end-10+'px';
			$point_e[measure_index].style.top = y_end-10+'px';
			cnt=0;
			x_dif = ((x_end-x_start) * $lean[0].textContent).toFixed(2);
			y_dif = ((y_end-y_start) * $lean[0].textContent).toFixed(2);
			x_y_length =((x_dif**2+y_dif**2)**(1/2) * $lean[0].textContent).toFixed(2);
			$lean[(measure_index*3-2)].textContent = x_dif;
			$lean[(measure_index*3-1)].textContent = y_dif;
			$lean[(measure_index*3)].textContent = x_y_length;
			let index = 0;
			while(index < tabLen){
			$tab_data[index].classList.remove(ACTIVATE_);
			index++;
			};
			measure_index =10;
		}
	};
	//******選択項目を黒くする関数*********************************************************************************************: */
	const handleClick_tab = (e)=>{
		e.preventDefault();
		const $this = e.target;
		let targetVal = $this.dataset.tabno;
		let index = 0;
		while(index < tabLen){
			$tab_data[index].classList.remove(ACTIVATE_);
			index++;
		};
		$tab_data[targetVal].classList.add(ACTIVATE_);
		return targetVal;
	};

	// ***指定ポイントの座標をクリック時にとるためのイベント*************************************************************************
	$preview.addEventListener('click', (e)=>handleClick(e));
	//*****どの項目を選択するかをクリックで取ってくるイベント************************************************************************ */
	let index_click=0;
    while(index_click < tabLen){
        $tab_data [index_click].addEventListener('click', (e)=> handleClick_tab(e));
        index_click++;
    };
	// ***************************************************************************************************
}) ();

