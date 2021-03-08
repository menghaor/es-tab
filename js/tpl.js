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
	win.Tpl = win.Tpl || Tpl;
})(window);
