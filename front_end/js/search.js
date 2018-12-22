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

	/*
	mui('.mui-input-clear').addEventListener('keydown', function(e) {
		if (13 == e.keyCode) {
			mui.openWindow({url: 'searchResult.html'});
		}
	}, false);
	*/

	mui('.search-history-list').on('tap', '.mui-table-view-cell', function() {
		mui.openWindow({url: 'searchResult.html'});
	});

	mui('body').on('tap', 'nav', function() {
		mui.openWindow({url: 'player.html'});
	});

	mui('.hot-search-lists').on('tap', '.hot-search-item', function() {
		mui.openWindow({url: 'searchResult.html'});
	});

}
