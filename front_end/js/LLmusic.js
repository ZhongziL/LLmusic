// 全局信息
var userInfo = null; // 用户信息
var AudioManager = {
	// 播放器
	audio: null,
	audioSrc: null,

	// 设定audio元素
	setAudio: function(dom, src) {
		this.audio = dom.createElement('AUDIO');
		this.audioSrc = src;
		this.playingButton = dom.getElementsByClassName('.playing-button.playing')[0];
		this.audio.src = this.audioSrc;
	},

	// 暂停与继续
	play_pause: function(dom) {
		if (this.audio == null) return false;

		if (this.audio.paused) {
			this.audio.play();
		} else {
			this.audio.pause();
		}
	},
};

// 页面管理
var pagesHistory = []; // 页面栈
var values = null; // 页面间传值

var pageChange = (target) => {
	// 等待侧滑关闭
	if (mui('.mui-off-canvas-wrap').offCanvas().isShown())
		mui('.mui-off-canvas-wrap').offCanvas().close();
	while(mui('.mui-off-canvas-wrap').offCanvas().isShown());

	// 页面切换
	console.log(pagesHistory)
	pagesHistory.push($('iframe')[0].src);
	if (target == 'pages/index.html') pagesHistory = [];
	$('iframe')[0].setAttribute("src", target);
}

var pageReturn = () => {
	// 页面后退
	if (pagesHistory == [])
		$('iframe')[0].setAttribute("src", 'pages/index.html');
	else
		$('iframe')[0].setAttribute("src", pagesHistory.pop());
}

var pageSet = {
	setPlayNav: (isShow) => {
		return;
		if (isShow) {
			$('iframe')[0].style.paddingBottom = '100px';
			$('#playing-song')[0].style.display = 'block';
		} else {
			$('iframe')[0].style.paddingBottom = '0';
			$('#playing-song')[0].style.display = 'none';
		}
	}
}

// 主页面初始化
window.onload = function() {
	mui.init();
	
	// 页面内容：侧滑、头部、主体、播放条显示
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
		outBtn.style.backgroundImage = "url('resources/loading.png')";
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
		parent.pageChange('pages/personalCenter.html');
	});	
	$('.sign-in').bind('click', (event) => {
		// 登录
		pageSet.setPlayNav(false);
		parent.pageChange('pages/signIn.html');
	});
	$('.sign-up').bind('click', (event) => {
		// 注册
		pageSet.setPlayNav(false);
		parent.pageChange('pages/signUp.html');
	});

	// 主体
	$('iframe')[0].setAttribute("src", 'pages/index.html');
	$('iframe')[0].style.paddingBottom = '100px';
	$('#playing-song')[0].style.display = 'block';
	
	// 用户信息
	// 登录情况检查
	if ($.cookie('userinfo') != undefined && $.cookie('userinfo') != 'null') {
		console.log($.cookie('userinfo') == undefined)
		parent.userInfo = JSON.parse($.cookie('userinfo'));
		$('#logout-control')[0].style.display = 'block';
		$('#sign-control')[0].style.display = 'none';
	} else {
		$('#logout-control')[0].style.display = 'none';
		$('#sign-control')[0].style.display = 'block';
	}
	
	// TODO 音乐控件
	AudioManager.setAudio(document, 'resources/temp/刘世超 - S&Silence (TVsize).mp3');
	$('#playing-song').bind('click', (event) => {
		AudioManager.play_pause();
		var playingButton = $('.playing-button.playing')[0]
		if (AudioManager.audio.paused) {
			playingButton.setAttribute("style", "background-image: url(resources/play.png)");
		} else {
			playingButton.setAttribute("style", "background-image: url(resources/pause.png)");
			AudioManager.audio.addEventListener('ended', () => {
				playingButton.setAttribute("style", "background-image: url(resources/play.png)");
			}, false);
		}
	});

	// TODO 监听返回按键
	/* window.addEventListener("popstate", function(){
		pageChange(pagesHistory[pagesHistory.length - 1]);
		pagesHistory.pop()
	}, false); */
}
