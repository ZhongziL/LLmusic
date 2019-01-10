window.onload = function() {
	mui.init({ swipeBack: false, statusBarBackground: 'darkcyan' });
	mui('.mui-scroll-wrapper').scroll();
	// 切换列表种类
	// TODO 未实现真的切换
	$('#list-title span').bind('click', (event) => {
		if (!event.currentTarget.className.includes('listClass-active')) {
			var spans = $('#list-title span')
			if (spans[0].className == "listClass-active") {
				spans[0].className = '';
				spans[1].className = 'listClass-active';
			} else {
				spans[0].className = 'listClass-active';
				spans[1].className = '';
			}
		}
	});
}