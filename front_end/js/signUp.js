window.onload = function() {
	mui.init({ swipeBack: true}); //启用右滑关闭功能 
	
	// 按钮绑定
	$('.mui-pull-left').bind('click', (event) => {
		parent.PageManager.open('pages/index.html');
	});
	
	$('.mui-pull-right').bind('click', (event) => {
		parent.PageManager.open('pages/signIn.html');
	});
	
	$('.mui-btn').bind('click', (event) => {
		var username = $('#username')[0].value;
		var password = $('#password')[0].value;
		var confirmPsw = $('#confirmPassword')[0].value;
		
		if (username == '') {
			mui.toast('请输入用户名/邮箱/手机号');
			return;
		}
		if (password == '') {
			mui.toast('请输入密码');
			return;
		}
		if (confirmPsw == '') {
			mui.toast('请再次输入密码');
			return;
		}
		if (password != confirmPsw) {
			mui.toast("两次输入的密码不一致");
			return;
		}
        
        parent.Tools.toast("注册中...");
        parent.UserManager.register({
            data: {
            	username: username,
            	password: password
            },
            error: (req, err, expected) => {
            	mui.toast('服务器或网络错误，请检查网络后重试');
            },
            success: (data, text) => {
                if (data.username) {
                    mui.toast('注册成功');
                    parent.PageManager.open('pages/index.html');
                } else if (data == "username is already exist") {
                    mui.toast("该用户名已存在")
                }
            },
            complete: () => {
            	parent.Tools.closeToast();
            }
        });
	});
};