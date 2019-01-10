window.onload = function() {
	mui.init({ swipeBack: true}); //启用右滑关闭功能 
	
	parent.pageSet.setPlayNav(false); // 关闭播放条
	
	$('.mui-pull-left').bind('click', (event) => {
		parent.pageChange('pages/signUp.html', 'pages/index.html');
	});
	$('.mui-pull-right').bind('click', (event) => {
		parent.pageChange('pages/signUp.html', 'pages/signIn.html');
	});
	
	$('.mui-btn').bind('click', (event) => {
		var username = $('#username')[0].value;
		var password = $('#password')[0].value;
		var confirmPsw = $('#confirmPassword')[0].value;
		
		if (username == '') {
			alert('请输入用户名/邮箱/手机号');
			return;
		}
		if (password == '') {
			alert('请输入密码');
			return;
		}
		if (confirmPsw == '') {
			alert('请再次输入密码');
			return;
		}
		if (password != confirmPsw) {
			alert("两次输入的密码不一致");
			return;
		}
		
		var post_url = 'http://172.18.160.110:5000/register';
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
				// TODO 网络成功，检查其他失败情况
				console.log(data)
				console.log(text)
			}
		})
	});
};