window.onload = function() {
	mui.init({
		swipeBack: false
	});
	(function($) {
		$('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
		var html2 = '<ul class="mui-table-view"><li class="mui-table-view-cell single-item singer-item"><img class="mui-media-object mui-pull-left" src="../resources/photo.jpg"><div class="mui-media-body"><h1>歌手名</h1><p class="mui-ellipsis">单曲 : 66  专辑 : 77</p></div></li></ul>';
		var html3 = '<ul class="mui-table-view"><li class="mui-table-view-cell single-item user-item"><img class="mui-media-object mui-pull-left" src="../resources/photo.jpg"><div class="mui-media-body"><h1>用户名</h1><p class="mui-ellipsis">250人关注</p></div><button type="button" class="mui-btn mui-btn-success mui-btn-outlined btn-follow">关注</button></li></ul>';
		var item2 = document.getElementById('item2mobile');
		var item3 = document.getElementById('item3mobile');
		document.getElementById('slider').addEventListener('slide', function(e) {
			if (e.detail.slideNumber === 1) {
				if (item2.querySelector('.mui-loading')) {
					setTimeout(function() {
						item2.querySelector('.mui-scroll').innerHTML = html2;
					}, 0);
				}
			} else if (e.detail.slideNumber === 2) {
				if (item3.querySelector('.mui-loading')) {
					setTimeout(function() {
						item3.querySelector('.mui-scroll').innerHTML = html3;
					}, 0);
				}
			}
		});
	})(mui);
	
	mui('.mui-table-view').on('tap', '.song-item', function() {
		mui.openWindow({url: 'player.html'});
	});
	
	mui('.mui-table-view').on('tap', '.singer-item', function() {
		mui.openWindow({url: 'personalCenter.html'});
	});
	
	mui('.mui-table-view').on('tap', '.user-item', function() {
		mui.openWindow({url: 'personalCenter.html'});
	});
	
	mui('body').on('tap', 'nav', function() {
		mui.openWindow({url: 'player.html'});
	});
}
