/**
 * Description: my-tab核心模块
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
