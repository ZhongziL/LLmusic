window.onload = function() {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	
	mui('.mui-content').on('click', '.mui-btn', function() {
		// TODO : get value from input box
		var username = 'Liang';
		var password = '123456';
		var repeatPassword = '123456';

		// TODO: check if password and repeatPassword are the same

		var post_url = 'http://172.18.160.110:5000/register';
		$.post(post_url,
			{ // 数据
				username: username,
				password: password,
			},
			function (data, textStatus) {
				if (textStatus === "success") {
					// TODO: get back the data and save cookies
					// document.cookie = data.split(";")[0];
					alert(textStatus);
				} else {
					alert(textStatus);
				}
			}
		);
	});
};