window.onload = function() {
	mui.init({
		swipeBack: false,
		statusBarBackground: 'darkcyan'
	});

	(function($) {
		$('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
		var sliderSegmentedControl = document.getElementById('sliderSegmentedControl');
		$('.mui-input-group').on('change', 'input', function() {
			if (this.checked) {
				sliderSegmentedControl.className = 'mui-slider-indicator mui-segmented-control mui-segmented-control-inverted mui-segmented-control-' + this.value;
				//force repaint
				sliderProgressBar.setAttribute('style', sliderProgressBar.getAttribute('style'));
			}
		});
	})(mui);
	
	mui('.mui-content').on('tap', '.search-box', function() {
		mui.openWindow({url: 'pages/search.html'});
	});
	
	mui('.mui-content').on('tap', '.personal-card', function() {
		mui.openWindow({url: 'pages/personalCenter.html'});
	});
	
	mui('.mui-content').on('tap', '.main-list', function() {
		mui.openWindow({url: 'pages/SongList.html'});
	});
	
	mui('.mui-content .mui-table-view').on('tap', '.mui-table-view-cell', function() {
		mui.openWindow({url: 'pages/songList.html'});
	});
	
	mui('.aside-list').on('tap', '.sign-up', function() {
		mui.openWindow({url: 'pages/Signup.html'});
	});
	
	mui('.aside-list').on('tap', '.sign-in', function() {
		mui.openWindow({url: 'pages/SignIn.html'});
	});
	
	mui('.mui-inner-wrap').on('tap', 'nav', function() {
		mui.openWindow({url: 'pages/player.html'});
	});
};