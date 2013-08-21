mv-tips.js
==========

Examples
--------

[demo](index.html)


快速初始化
-------

`<a href="#" data-toggle="mv-tips" data-title="这是一个提示">Tooltip on top</a>`

调用方式
----

`$('#example').tip(options,[argu]);`

	+ options 为对象则传入配置
	+ options 为字符串则执行方法，并可传入参数argu

配置
-----

	options 对象:
	{
		placement: 'bottom',
		title: 'mv-tips',
		template: '<div class="tip"><div class="tip-arrow"></div><div class="tip-inner"></div></div>',
		trigger: 'hover',
	}


方法
----

### show
显示
`$('#example').tip('show');`
### hide
隐藏
`$('#example').tip('hide');`
### toggle
切换显示隐藏
`$('#example').tip('toggle');`
### setPos
传入自定义位置
`$('#example').tip('setPos',[argu]);`

	argu 对象:
	{
		top: 0,
		left: 0
	}



事件
----

### show
触发显示

### shown
显示完成

### hide
触发隐藏

### hidden
隐藏完成


Author
------
贾硕 / mediav.com
