window.onload = function() {
	mui.init({
		swipeBack: false,
		statusBarBackground: 'darkcyan'
	});
	
	// 页面设置
	parent.pageSet.setPlayNav(true);

	// 页面跳转绑定
	$('.main-list, .song-list-cell').bind('click', (event) => {
		parent.values = { listName: event.currentTarget.getElementsByTagName('span')[0].textContent };
		parent.pageChange('pages/songList.html');
	});
	
	$('#personal-card').bind('click', (event) => {
		parent.pageChange('pages/personalCenter.html');
	});
	
	// 切换列表种类
	$('#like-title span').bind('click', (event) => {
		if (!event.currentTarget.className.includes('listClass-active')) {
			var spans = $('#like-title span')
			if (spans[0].className == "listClass-active") {
				spans[0].className = '';
				spans[1].className = 'listClass-active';
			} else {
				spans[0].className = 'listClass-active';
				spans[1].className = '';
			}
		}
	});

	// 侧滑调出
	$('.mui-action-menu').bind('click', (event) => {
		parent.mui('.mui-off-canvas-wrap').offCanvas().show();
	});
};
