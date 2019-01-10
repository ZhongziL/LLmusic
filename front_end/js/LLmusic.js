// 全局信息
var userInfo = null; // 用户信息
var AudioManager = {
	// 播放器
	audio: null,
	audioSrc: null,

	// 设定audio元素
	setAudio: function(src) {
		if (AudioManager.audio == null) AudioManager.audio = document.createElement('AUDIO');
		AudioManager.audioSrc = src;
		AudioManager.audio.src = AudioManager.audioSrc;
	},

	// 暂停与继续
	play_pause: function(dom) {
		if (AudioManager.audio == null) return false;

		if (AudioManager.audio.paused) {
			AudioManager.audio.play();
		} else {
			AudioManager.audio.pause();
		}
	},
};

// 页面管理
var PageManager = {
	history: [], // 页面栈
	values: null, // 页面间传值
	reBack: () => {
		// 页面后退
		if (PageManager.history == [])
			$('iframe')[0].setAttribute("src", 'pages/index.html');
		else
			$('iframe')[0].setAttribute("src", PageManager.history.pop());
	},
	open: (src) => {
		// 页面跳转
		if (src.includes('index')) {
			PageManager.history = [];
		} else {
			PageManager.history.push($('iframe')[0].src);
		}
		$('iframe')[0].setAttribute("src", src);
	}
}

// 主页面初始化
window.onload = function() {
	mui.init();

	// 主体
	$('iframe')[0].setAttribute("src", 'pages/index.html');

	// 用户信息
	// 登录情况检查
	if ($.cookie('userinfo') != undefined && $.cookie('userinfo') != 'null') {
		console.log($.cookie('userinfo') == undefined)
		parent.userInfo = JSON.parse($.cookie('userinfo'));
	}
	
	// 音乐控件
	AudioManager.setAudio('resources/temp/刘世超 - S&Silence (TVsize).mp3');

	// TODO 监听返回按键
	/* window.addEventListener("popstate", function(){
		pageChange(pagesHistory[pagesHistory.length - 1]);
		pagesHistory.pop()
	}, false); */
}
