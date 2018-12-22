window.onload = function() {
		mui.init({
		swipeBack: false
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
	
	mui('.mui-content').on('tap', '.focus', function() {
		mui.openWindow({url: 'followingList.html'});
	});
	
	mui('.mui-content').on('tap', '.fans', function() {
		mui.openWindow({url: 'followerList.html'});
	});
	
	mui('.mui-content').on('tap', '.my-like-list', function() {
		mui.openWindow({url: 'SongList.html'});
	});
	
	mui('.mui-content').on('tap', '.my-like-list', function() {
		mui.openWindow({url: 'SongList.html'});
	});
	
	mui('.mui-content').on('tap', '.my-song-lists', function() {
		mui.openWindow({url: 'SongList.html'});
	});
	
	mui('body').on('tap', '.playing-song', function() {
		mui.openWindow({url: 'player.html'});
	});
};
