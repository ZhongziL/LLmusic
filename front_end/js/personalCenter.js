window.onload = function() {
	mui.init({ swipeBack: true }); // 启用右滑关闭功能
	
	parent.pageSet.setPlayNav(true); // 开启播放条
	
	$('li').bind('click', (event) => {
		parent.values = { listName: event.currentTarget.getElementsByTagName('span')[0].textContent };
		parent.pageChange('pages/personalCenter.html', 'pages/songList.html');
	});
	
	$('.nav-back').bind('click', parent.pageReturn);
};
