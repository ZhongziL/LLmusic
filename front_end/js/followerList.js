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

mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
	mui.openWindow({url: 'personalCenter.html'});
});

mui('body').on('tap', '.playing-song', function() {
	mui.openWindow({url: 'player.html'});
});