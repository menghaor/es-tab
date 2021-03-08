# 原生js oop思维手撸tab选项卡

> 采用es3 + 闭包 + OOP的思想封装tab选项卡切换；



### 效果图

![](https://img-blog.csdnimg.cn/20210308104956143.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L21lbmdoYW9lcg==,size_16,color_FFFFFF,t_70#pic_center)

### 1.目录结构

```bash
|-- my-tab
    |-- inedx.html            #视图
    |-- js                    #逻辑代码
        |-- my-tab.js         #核心代码模块
        |-- tpl.js            #模板相关模块
```

### 2.代码

#### 2.1 index.html

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style>
			#my-tab {
				width: 500px;
				height: 500px;
				border: 1px solid #000;
			}

			.tab-wrapper {
				overflow: hidden;
				border-bottom: 1px solid #333;
			}

			.tab-wrapper .tab-item {
				float: left;
				widith: 33.333%;
				height: 50px;
				line-height: 50px;
				padding: 0 20px;
				box-sizing: border-box;
				cursor: pointer;
			}

			.tab-wrapper .tab-item.current {
				background: #000;
				color: #fff;
			}

			.content-wrapper {
				position: relative;
				left: 0;
				height: 450px;
			}

			.content-wrapper .content-item {
				display: none;
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				line-height: 450px;
				text-align: center;
			}

			.content-wrapper .content-item.current {
				display: block;
			}
		</style>
	</head>
	<body>
		<div id="my-tab"></div>
	</body>

	<script src="./js/tpl.js"></script>
	<script src="./js/my-tab.js"></script>
	<script>
		var tab1 = new MyTab('#my-tab', {
			"tab": [{
				"tabName": "tab1",
				"content": "内容111"
			}, {
				"tabName": "tab2",
				"content": "内容222"
			}, {
				"tabName": "tab3",
				"content": "内容333"
			}],
			"active": 0
		})
	</script>
</html>

```


#### 2.2 my-tab.js

```javascript
/**
 * Description: my-table核心模块
 * Author: haor
 * CreateTime: 2020-03-07
 */

;
(function(doc, win, tpl) {
	/**
	 * tab构造器
	 * @param {String} el 容器选择器
	 * @param {Object} options 配置文件
	 */
	function MyTab(el, options) {
		if (!el) return;
		this.el = document.querySelector(el)
		this.options = options || {}
		this.init();
	}

	/**
	 * 初始化
	 */
	MyTab.prototype.init = function() {
		var tabConf = this.options;
		this._setActiveIndex(tabConf.active);
		this._render(tabConf);
		this._bindEvent();
	}

	/**
	 * 渲染内容
	 * @param {Object} conf 配置信息
	 */
	MyTab.prototype._render = function(conf) {
		var tabWrapper = doc.createElement('div'),
			contentWrapper = doc.createElement('div'),
			oFrag = doc.createDocumentFragment();
		tabWrapper.className = 'tab-wrapper';
		contentWrapper.className = 'content-wrapper';
		var tabList = Array.isArray(conf.tab) ? conf.tab : [];
		var tabTpl = new tpl(); //初始化一个模板实例
		for (var i = 0, len = tabList.length; i < len; i++) {
			var tab = tabList[i];
			var paseData = {
				current: i === this.activeIndex ? 'current' : '',
				tabName: tab.tabName,
				tabContent: tab.content
			};

			tabWrapper.innerHTML += tabTpl.parseTpl(tabTpl.getTpl('tab', tab), paseData);
			contentWrapper.innerHTML += tabTpl.parseTpl(tabTpl.getTpl('content', tab), paseData);
		}
		oFrag.appendChild(tabWrapper)
		oFrag.appendChild(contentWrapper)
		this.el.appendChild(oFrag)
	}

	/**
	 * 绑定事件
	 */
	MyTab.prototype._bindEvent = function() {
		var data = {
			tabs: doc.querySelectorAll('.tab-item'),
			contents: doc.querySelectorAll('.content-item')
		}
		this.el.addEventListener('click', this.handlerTabClick.bind(this, data), false)
	}

	/**
	 * 处理tab点击事件
	 */
	MyTab.prototype.handlerTabClick = function() {
		var els = arguments[0],
			tar = arguments[1].target;
		if (tar.className.trim() !== 'tab-item') return;
		var activeIndex = [].indexOf.call(els.tabs, tar); //当前点击index
		els.tabs.forEach(function(item, idx) {
			item.className = 'tab-item';
			els.contents[idx].className = 'content-item';
		})
		els.tabs[activeIndex].className += ' current';
		els.contents[activeIndex].className += ' current';
		this._setActiveIndex(activeIndex); //设置索引
	}

	/**
	 * 设置选中索引
	 * @param {Number} idx
	 */
	MyTab.prototype._setActiveIndex = function(idx) {
		var tabLen = doc.querySelectorAll('.tab-item').length;
		idx = idx > tabLen ? tabLen : idx;
		this.el.setAttribute('data-active-index', idx)
		this.activeIndex = idx;
	}

	//export
	win.MyTab = win.MyTab || MyTab
})(document, window, window.Tpl);
```

#### 2.3 tpl.js

```javascript
/**
 * Description: 模板模块
 * Author: haor
 * CreateTime: 2020-03-07
 */

;
(function(win) {
	function Tpl(tempReg) {
		this.tmpReg = tempReg || /\{\{(.+?)\}\}/g;
	}

	/**
	 * 获取模板
	 * @param {String} type 模板类型
	 * @return {String} 
	 */
	Tpl.prototype.getTpl = function(type, tab) {
		switch (type) {
			case 'tab':
				return `<div class="tab-item {{ current }}"> {{ tabName }} </div>`;
			case 'content':
				return `<div class="content-item {{ current }}">{{ tabContent }}</div>`;
			default:
				return ''
		}
	}

	/**
	 * 解析模板
	 * @param {String} tpl 模板字符串
	 * @param {Object} data 数据
	 * @return {String}
	 */
	Tpl.prototype.parseTpl = function(tpl, data) {
		return tpl.replace(this.tmpReg, function(match, key, value) {
			return data[key.trim()];
		})
	}

	//export
	win.Tpl = Tpl;
})(window);
```



小提示

> 觉得不错的话，给作者来个Star吧，谢谢~