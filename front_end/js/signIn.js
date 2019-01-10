window.onload = function() {
	mui.init({ swipeBack: true }); //启用右滑关闭功能

	// 按钮绑定
	$('.mui-pull-left').bind('click', (event) => {
		parent.PageManager.reBack();
	});
	
	$('.mui-pull-right').bind('click', (event) => {
		parent.PageManager.open('pages/signUp.html');
	});
	
	var mask = {
		// 遮罩
		show: () => {
			$("body").append("<div class='backdrop'></div>");
		},
		close: () => {
			$(".backdrop").remove();
		}
	}
	$('.mui-btn').bind('click', (event) => {
		var username = $('[type=text]')[0].value;
		var password = $('[type=password]')[0].value;
		if (username == '') {
			alert('请输入用户名/邮箱/手机号');
			return;
		}
		if (password == '') {
			alert('请输入密码');
			return;
		}

		mask.show();
		var btn = $('button')[0];
		btn.style.backgroundImage = "url('../resources/loading.png')";
		btn.textContent = "";

		var post_url = 'http://172.18.160.110:5000/login';
		$.ajax({
			url: post_url,
			method: 'post',
			xhrFields: { withCredentials: true },
			crossDomain: true,
			data: {
				username: username,
				password: password
			},
			error: (req, err, expected) => {
				alert('服务器或网络错误，请检查网络后重试');
			},
			success: (data, text) => {
				if (data.username) {
					alert('登录成功');
					parent.userInfo = data;
					$.cookie('userinfo', JSON.stringify(data));
					parent.PageManager.open('pages/index.html');
				} else if (data == 'no user' || data == 'password error') {
					alert('用户名或密码错误，请检查后重试')
				}
			},
			complete: () => {
				mask.close();
				btn.style.backgroundImage = "";
				btn.textContent = "登录";
			}
		})
	});
};