// 显示上下文菜单；
function showContextmenu(e,menuData){
	e.preventDefault(); // 阻止默认事件；
	var contextmenu = document.querySelector('#contextmenu');
	// 清空、显示右击菜单；
	contextmenu.style.display = 'block';
	contextmenu.innerHTML = '';
	newMenu(menuData);
	function newMenu(menuData){
		// 根据数据新建菜单内容；
		menuData.forEach(function(item){
			var li = document.createElement('li');
			li.innerHTML = item.name;
			li.prevLi = false;
			if(item.childer){
				li.classList.add('arrow');
			}
			//移上显示下级菜单；
			li.onmouseover = function(e){
				// 鼠标移动时还在同一个li上，就不再执行；
				if(this.prevLi){
					return;
				}
				this.prevLi = true;
				var liall = li.parentNode.children;
				for (var i=0; i<liall.length; i++) {
					li_ul = liall[i].querySelectorAll('ul')[0];
					if (li_ul) {
						li_ul.parentNode.removeChild(li_ul);
					}
				}
				if(item.childer){
					newNextMenu(item.childer,li,e);
				}
				
			}
			// 显示下级菜单；
			function newNextMenu(data,li,e){
				var ul = document.createElement('ul');
				li.appendChild(ul);
				ul.style.display = 'block';
				data.forEach(function(item){
					var lis = document.createElement('li');
					lis.innerHTML = item.name;
					lis.onmousedown = contextmenuOn[item.callbackname];
					ul.appendChild(lis);
				});
				// 设置 二级菜单位置；
				var rects = contextmenu.getBoundingClientRect();
				var lisHeihgt = contextmenu.offsetHeight/ul.children.length;
				var nextMenuX = document.documentElement.clientWidth - rects.left -contextmenu.offsetWidth;
				var nextMenuY = document.documentElement.clientHeight - rects.top -contextmenu.offsetHeight + lisHeihgt;
				if(nextMenuX > ul.offsetWidth){
					ul.style.left = li.offsetWidth + 2 + 'px';
				}else{
					ul.style.left = -ul.offsetWidth - 2 + 'px';
				};
				if(nextMenuY > ul.offsetHeight){
					ul.style.top = li.offsetHeight - lisHeihgt + 'px';
				}else{
					ul.style.top = -ul.offsetHeight + lisHeihgt + 'px';
				}
				
				
			}
			
			li.onmouseout = function(e){
				this.prevLi = false;
			}
			li.onmousedown = contextmenuOn[item.callbackname];
			li.oncontextmenu = function(){
				view(data.list);
				hideContextmenu();
			};
			contextmenu.appendChild(li);
		});
	}
		
	// 设置菜单显示位置与鼠标一致；
	//var rects = document.getBoundingClientRect();
	var maxX = document.documentElement.clientWidth - contextmenu.offsetWidth;
	var maxY = document.documentElement.clientHeight - contextmenu.offsetHeight;
	// 设置最大值，防止出现滚动条；
	var x = e.clientX > maxX ? maxX : e.clientX;
	var y = e.clientY > maxY ? maxY : e.clientY;
	
	contextmenu.style.left = x + 'px';
	contextmenu.style.top = y + 'px';
	
}
// 隐藏上下文菜单；
function hideContextmenu(){
	contextmenu.style.display = 'none';
}
// 添加数据
function addData(newData){
	data.list.push(newData);
}

// 回收站有垃圾状态；
var recycleFull = false;

// 拖拽,克隆,换位；
function drag(el){
	el.addEventListener('mousedown',down);
	function down(e){
		//非左键不执行
		if(e.button != 0){
			return;
		};
		if(e.target.tagName.toUpperCase() != 'LI'){
			return;
		}
		var start = {
			x: e.clientX,
			y: e.clientY
		}
		var elCss = {
			x: css(el, 'left'),
			y: css(el, 'top')
		}
		var newNode = el.cloneNode(true);
		newNode.style.opacity = .5;
		el.parentNode.appendChild(newNode);
		e.preventDefault();
		
		document.addEventListener('mousemove', move);
		document.addEventListener('mouseup', end);
		//移动时；
		function move(e){
			var now = {
				x: e.clientX,
				y: e.clientY
			}
			var newNodeX = now.x - start.x + elCss.x;
			var newNodeY = now.y - start.y + elCss.y;
			css(newNode,'left',newNodeX);
			css(newNode,'top',newNodeY);
		}
		// 鼠标放开时；
		function end(e){
			document.removeEventListener('mousemove', move);
			document.removeEventListener('mouseup', end);
			
			var lis = document.querySelectorAll('#list li');
			var disX = css(newNode,'left') - css(el,'left');
			var disY = css(newNode,'top') - css(el,'top');
			//确保真的有拖动才检测；
			if(Math.abs(disX)>1 || Math.abs(disY) >1){
				for( var i=0; i<lis.length; i++){
					// 去掉自己和自己克隆的对象,并且有和其他的碰撞；
					if(	lis[i] != el 
						&& lis[i] != newNode 
						&& getCollide(newNode,lis[i]) ){
						if ( lis[i].classList.contains('wasteBasket') ) {
							recycleFull = true;
							data.list = removeData(el.item.id);
						} else{
							//获取被拖拽的元素
							var elNode = getElNode(el.item.id)[0];
							//获取被拖拽元素的索引值，然后删除；
							data.list.splice( data.list.indexOf(elNode),1 );
							//获取被碰撞的元素
							var lisNode = getElNode(lis[i].item.id)[0];
							//把拖拽的元素插入到碰撞元素的后面；
							data.list.splice( (data.list.indexOf(lisNode)+1),0,elNode );						
						}
						
					}
				}
				view(data.list);	
			}else{
				if( !el.classList.contains('wasteBasket') ){
					addActive(el);
				}
				removeEle(lis[lis.length-1]);
			}
		}
	}
}
// 删除元素节点； 
function removeEle(removeObj) { 
	removeObj.parentNode.removeChild(removeObj); 
}
// 去掉删除的数据；
function removeData(id){
	return data.list.filter(function(item){
		if(item.id == id){
			return false;
		}
		return true;
	})
}
// 根据ID找元素；
function getElNode(id){
	return data.list.filter(function(item,index){
		if( item.id == id ){
			return item;
		};
	})
}
// 是否碰撞；
function getCollide(el,el2){
	var rect = el.getBoundingClientRect();
	var rect2 = el2.getBoundingClientRect();
	var elHalf = el.offsetHeight/2;
	if(  (rect.right-elHalf) < rect2.left
		||(rect.left+elHalf) > (rect2.right)
		||(rect.bottom-elHalf)<rect2.top
		||(rect.top+elHalf)>rect2.bottom ){
		return false;
	}
	return true;
}

//添加选中状态；
function addActive(li){
	var lis = document.querySelectorAll('li');
	for(var i=0; i<lis.length; i++){
		lis[i].classList.remove('active');
	}
	li.classList.add('active');
}

var reNameId,chooseId,fileName,nowId,nowType,hisName,noReName;

// 是否重名or没更改；
function isSameName(obj){
	hisName = false;//用来记录是否重名；
	noReName = false;//用来记录是否有重新命名；
	return obj.forEach(function(item){
		if(item.type){// 如果有后缀的，如文本、页面、图片；
			//如果命名后的名字和命名前的名字一致，返回没有重命名；
			if( (item.name + '.' + item.type) == fileName && item.id == nowId){
				return noReName = true;
			}//如果名字加后缀和现在的名字一致，并且ID不同，则返回重名确认；
			else if( (item.name + '.' + item.type) == fileName && item.id != nowId && item.type == nowType){
				return hisName = true;
			}
		}else{// 没有后缀的，如垃圾箱、文件夹；
			if( item.name == fileName && item.id != nowId && item.type == nowType){
				return hisName = true;
			}
		}
	});
}
// 重命名
function reName(id){
	var reNameIndex = data.list.indexOf( getElNode(id)[0] );
	var lis = document.querySelectorAll('#list li');
	var font = lis[reNameIndex].children[0];
	var inputs = lis[reNameIndex].querySelector('input');
	// 获取文本焦点
	setTimeout(function(){
		inputs.style.display = 'block';
		inputs.focus();
		font.style.display = 'none';
		inputs.value = font.innerHTML;
		inputs.select();
	},10);
	// 焦点选中时，按回车键，命名结束；
	document.addEventListener('keyup',function(e){
		if(e.keyCode == 13){
			inputs.blur();
		}
	});
	//失去焦点时；
	inputs.onblur = function(){
		inputs.style.display = 'none';
		font.style.display = 'block';
		font.innerHTML = fileName = inputs.value;
		//当前操作的数据ID；
		nowId = this.parentNode.item.id;
		nowType =  this.parentNode.item.type;
		//运行是否重名；
		isSameName(data.list);
		//如果没有重新命名，就返回不操作；
		if(noReName && fileName.trim("") != ""){
			return;
		}else if(fileName.trim("") == ""){
			alert('名字不能为空');
			view(data.list);
		}else if(!hisName && fileName.trim("") != ""){//如果没有同名，就提交数据；
			lis[reNameIndex].item.name = inputs.value;
		}else{//如果重名了，就提示；
			alert('名字重复了，请重新修改');
			view(data.list);
		}
	}
	hideContextmenu();
}


var maxId = 0;
// 获取文件名最大数字；
function getMaxId(){
	data.list.forEach(function(item){
		if(maxId < item.id){
			maxId = item.id;
		}
	});
}
// ========新建文件夹=======
var upName = '新建文件夹';
var nextName = '';
var fileNub = 2;
// 获取文件夹名称后半段括号里的数字；
function getNextName(){
	//用来记录是否有【新建文件夹】这个名称；
	var uNewFile = false;
	data.list.forEach(function(item){
		if(item.name == '新建文件夹'){
			return uNewFile = true;
		}
	});
	// 如果有新建文件夹，就加数字后缀，
	if(uNewFile){
		// 获取中断的数字；
		var sameNameArr = [];
		data.list.filter(function(item){
			// 前几位要是'新建文件夹 ('；
			if(item.name.substr(0,7) == '新建文件夹 ('
			//最后一位要是')'；
			&& item.name.substr(-1,1) == ')'
			//数字不能为0和1的；
			&& Number(item.name.substr(7,item.name.length-8))>1
			//括号中间只能是数字的；
			&& parseInt(item.name.substr(7,item.name.length-8)) == item.name.substr(7,item.name.length-8)
			){
				sameNameArr.push(item.name.substr(7,item.name.length-8));
			}
		})
		// 排列文件夹的数字【从小到大】；
		sameNameArr.sort(function(a,b){
			return a - b ;
		});
		// 返回后缀数字；
		for ( var i = 0; i<sameNameArr.length; i++) {
			if( sameNameArr[i] != (i+2) ){
				return ` (${i+2})`;
			}
		}
		return ` (${sameNameArr.length + 2})`;
	}else{//否则数字后缀为空；
		return '';
	}
}

// 新建文件夹;
function newFolder(e){
	if(e.button == 2){
		return;
	}
	var nextName = getNextName(); // 获取文件夹名称的后半段；
	getMaxId(); // 获取数据最大ID；
	// 添加数据；
	addData({
		id: maxId + 1 ,
//			type: 'floder',
        className: 'floder',
        name: upName + nextName
	});
	view(data.list); // 重新渲染；
	reName(data.list[data.list.length-1].id); // 重命名；
}

// 按拼音排序；
function sortSpell(){
	data.list.sort(function(a,b){
		if(pinyin.getFullChars(a.name) > pinyin.getFullChars(b.name)){
			return 1;
		} 
		return -1;
	});
	view(data.list);
}
// 按时间排序；
function sortTime(){
	data.list.sort(function(a,b){
		if(a.time > b.time){
			return 1;
		} 
		return -1;
	});
	view(data.list);
}
// 文件夹打开
function openNewFile(id){
	console.log('打开文件夹')
}

var contextmenuOn = {
	// 新建文件夹：
	createFloder: function(e){
		newFolder(e);	
	},
	//清空回收站；
	empty: function(){
		recycleFull = false;
		hideContextmenu();
		view(data.list);
	},
	//重命名；
	reName:function(){
		reName(chooseId);
	},
	// 删除；
	reMove:function(){
		recycleFull = true;
		data.list = removeData(chooseId);
		view(data.list);
		hideContextmenu();
	},
	
	// 上传文件；
	uploading:function(){
		var upload = document.querySelector('.uploading');
		if(upload){
			upload.remove();
		}
		var div = document.createElement('div');
		div.className = 'uploading';
		div.style.display = 'none';
		document.body.appendChild(div);
				
		var files = document.createElement('input');
		files.type = 'file';
		div.appendChild(files);

		files.click();
		hideContextmenu();
	},
	// 字母排序；
	sortSpell:function(e){
		if(e.button == 2){
			return;
		}
		sortSpell();
		hideContextmenu();
	},
	// 时间排序；
	sortTime:function(e){
		if(e.button == 2){
			return;
		}
		sortTime();
		hideContextmenu();
	},
	// 移上效果；
	limouseover:function(){
		this.classList.add('hover');
	},
	// 点击效果；
	liclick:function(e){
		this.classList.add('active');
		e.preventDefault;
	},
	// 离开效果；
	limouseout:function(){
		this.classList.remove('hover');
	}
	
}

// 创建、展示数据【重新渲染数据】；
function view(dataList){
	var list = document.querySelector('#list');
	var nub = 0;
	list.innerHTML = '';
	dataList.forEach(function(item,index){
		var li = document.createElement('li');
		li.className = `${item.className}`;
		if(recycleFull && item.id == 1){
			li.classList.add('full');
		}
		li.item = item;// 创建自定义属性；
		if(!data.list[index].time){
			data.list[index].time = Date.now();// 创建时间戳属性；
		}
		// 排除垃圾箱、文件夹的后缀；item.type == 'icon' || item.type == 'floder'
		if(!item.type){
			li.innerHTML =`<span class="fileName">${item.name}</span><p></p><input />`;
		}else{
			li.innerHTML =`<span class="fileName">${item.name}.${item.type}</span><p></p><input />`;
		}
		// 拖拽换位；
		drag(li);
		//给垃圾箱以外的文件添加事件；
		if( !li.classList.contains('wasteBasket') ){
//		if(item.className != 'wasteBasket'){
			li.onmouseover = contextmenuOn['limouseover'];
			li.onclick = contextmenuOn['liclick'];
			li.onmouseout = contextmenuOn['limouseout'];
		}
		//双击名字重命名；
		li.children[0].ondblclick = function(){
			reName(li.item.id);
		}
		//双击图标打开；
		li.children[1].ondblclick = function(){
			openNewFile(li.item.id);
		}

		// 每个图标的位置排列；
		list.appendChild(li);
		var line = Math.floor((document.documentElement.clientHeight-20)/(li.offsetHeight+35));
		li.style.top = (nub%line)*(li.offsetHeight+35) + 20 + 'px';
		li.style.left = Math.floor(nub/line)*(li.offsetWidth+20) + 10 + 'px';
		nub++;
	})
		
}





