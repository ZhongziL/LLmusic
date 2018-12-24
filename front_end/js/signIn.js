window.onload = function() {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	
	mui('.mui-content').on('click', '.mui-btn', function() {
		alert('?');
	});
}