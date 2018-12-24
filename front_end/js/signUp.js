window.onload = function() {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	
	mui('.mui-content').on('click', '.mui-btn', function() {
		var username = 'Liu';
		var password = '123456';

		var post_url = 'http://172.18.160.110:5000/register';
		$.post(post_url,
			{ // 数据
				username: username,
				password: password,
			},
			function (data, textStatus) {
				if (textStatus === "success") { // 登录或注册成功
					// document.cookie = data.split(";")[0];
					alert(textStatus);
				} else {    // 登录失败
					alert(textStatus);
				}
			}
		);
	});
};