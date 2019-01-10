window.onload = function() {
	mui.init({ swipeBack: false });
	(function($) {
		$('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
		var sliderSegmentedControl = document.getElementById('sliderSegmentedControl');
		$('.mui-input-group').on('change', 'input', function() {
			if (this.checked) {
				sliderSegmentedControl.className =
					'mui-slider-indicator mui-segmented-control mui-segmented-control-inverted mui-segmented-control-'
					+ this.value;
				//force repaint
				sliderProgressBar.setAttribute('style', sliderProgressBar.getAttribute('style'));
			}
		});
	})(mui);

	// 歌单信息填充
	mui(".song-list-info h1")[0].textContent = parent.values.listName;
	parent.pageSet.setPlayNav(true);
	
	// 页面跳转
	mui("header").on('tap', '.nav-back', parent.pageReturn );
}
