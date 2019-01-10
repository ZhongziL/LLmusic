window.onload = function() {
	mui.init({
		swipeBack: false,
		statusBarBackground: 'darkcyan'
	});

	// 主体页面跳转绑定
	$('.main-list, .song-list-cell').bind('click', (event) => {
		parent.values = { listName: event.currentTarget.getElementsByTagName('span')[0].textContent };
		parent.PageManager.open('pages/songList.html');
	});
	
	$('#personal-card').bind('click', (event) => {
		parent.PageManager.open('pages/personalCenter.html');
	});
	
	// 侧滑菜单按钮事件
	var mask = {
		// 遮罩
		show: () => { $("body").append("<div class='backdrop'></div>"); },
		close: () => { $(".backdrop").remove(); }
	};
	$('#logout-button').bind('click', (event) => {
		// 登出操作
		var outBtn = $('#logout-button')[0];
		if (outBtn.textContent == "") return;
		mask.show();
		outBtn.style.backgroundImage = "url('../resources/loading.png')";
		outBtn.textContent = "";
		var post_url = 'http://172.18.160.110:5000/logout';
		$.ajax({
			url: post_url,
			method: 'get',
			xhrFields: { withCredentials: true },
			crossDomain: true,
			complete: () => {
				$('#logout-control')[0].style.display = 'none';
				$('#sign-control')[0].style.display = 'block';
				$.cookie('userinfo', null);
				outBtn.style.backgroundImage = "";
				outBtn.textContent = "登出";
				mask.close();
				alert('您已登出');
			}
		});
	});
	$('#logout-control div').bind('click', (event) => {
		// 跳转个人
		parent.PageManager.open('pages/personalCenter.html');
	});	
	$('.sign-in').bind('click', (event) => {
		// 登录
		parent.PageManager.open('pages/signIn.html');
	});
	$('.sign-up').bind('click', (event) => {
		// 注册
		parent.PageManager.open('pages/signUp.html');
	});
	
	// 切换列表种类
	// TODO
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
		mui('.mui-off-canvas-wrap').offCanvas().show();
	});
	
	// TODO 音乐控件
	$('#play-nav-button-play').bind('click', (event) => {
		parent.AudioManager.play_pause();
		var playingButton = $('#play-nav-button-play')[0];
		if (parent.AudioManager.audio.paused) {
			playingButton.setAttribute("style", "background-image: url(../resources/play.png)");
		} else {
			playingButton.setAttribute("style", "background-image: url(../resources/pause.png)");
			parent.AudioManager.audio.addEventListener('ended', () => {
				playingButton.setAttribute("style", "background-image: url(../resources/play.png)");
			}, false);
		}
	});
};
