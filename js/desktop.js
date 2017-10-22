
view(data.list);


document.oncontextmenu = function(e){
	rightClick(e);
};
//右击功能；
function rightClick(e){
	// 点击到 li 上的操作；
	if (e.target.tagName.toUpperCase() == 'LI' ) {
		 // 点击到图标上的操作；
		if(e.target.className != '' && e.target.className != 'arrow'){
			if(e.target.classList.contains('wasteBasket') ){
				showContextmenu(e,data.menu.recycle);
			}else{
				showContextmenu(e,data.menu.file);
			}
			addActive(e.target);
			chooseId = e.target.item.id;
		}else{// 点击到二级菜单的操作：如果是右击，就让样式保持成原来的状态；
//			var rightClickMenuLeft = css(contextmenu,'left');
//			var rightClickMenuTop = css(contextmenu,'top');
//			showContextmenu(e,data.menu.main	);
//			css(contextmenu,'left',rightClickMenuLeft);
//			css(contextmenu,'top',rightClickMenuTop);
		}
		e.preventDefault(data.list);	
	}
	//点击到图标上的文字操作；
//	else if(e.target.tagName.toUpperCase() == 'SPAN'){
//		showContextmenu(e,data.menu.file	);
//		chooseId = e.target.parentNode.item.id;
//	}
	// 点击到桌面空白区域的操作；
	else{
		showContextmenu(e,data.menu.main	);
	}
	
}



document.onmousedown = function(e){
	if (e.target.tagName.toUpperCase() == 'LI'
	 || e.target.tagName.toUpperCase() == 'SPAN') {
		
	} else{
		hideContextmenu();
		var lis = document.querySelectorAll('li');
		for(var i=0; i<lis.length; i++){
			lis[i].classList.remove('active');
		}
	}
}

// ctrl + v 新建文件夹；
document.onkeydown = function(e){
	if(e.ctrlKey && e.keyCode == 86){
		newFolder(e);
	}
}



// 功能需求；
var tip = document.createElement('div');
tip.innerHTML = `
<div>
	<p>1、桌面右键：新建文件夹【ctrl + v 】, 排序：时间排序，顺序排序</p>
	<p>2、图标右键: 重命名、删除，回收站右键:重命名、清空回收站</p>
	<p>3、单个图标: 拖拽、碰撞中心点换位、碰回收站删除，双击文字重命名</p>
	<p>4、按enter键完成命名; </p>
</div>
`;
tip.style.cssText = 'position: absolute;right: 0;top: 0;padding: 10px;font-size: 12px;';
document.body.appendChild(tip);



//	<p>5、上传文件: 文本、图片、音频、视频等打开效果</p>
//	<p>6、框选、打开文件夹，面包屑导航</p>


/*
 
 
 
 
 * 
 * 
 * */


















