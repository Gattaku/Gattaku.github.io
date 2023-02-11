// 'use strict'

(()=>{
    const numPage =2; //Totalページ数を指定する必要あり
    const images = [];
    for (let i = 0; i < numPage ; i++){
        images.push(`explanation/image/image${i+1}.jpg`);
    }
    console.log(images);

    

    // const images = ['images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg', 'images/image5.jpg'];
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

}) ();