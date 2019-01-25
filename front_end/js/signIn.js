window.onload = function() {
    mui.init({
        swipeBack: true
    }); //启用右滑关闭功能

    // 按钮绑定
    $('.mui-pull-left').bind('click', (event) => {
        parent.PageManager.open('pages/index.html');
    });

    $('.mui-pull-right').bind('click', (event) => {
        parent.PageManager.open('pages/signUp.html');
    });

    $('.mui-btn').bind('click', (event) => {
        var username = $('[type=text]')[0].value;
        var password = $('[type=password]')[0].value;
        if (username == '') {
            mui.toast('请输入用户名/邮箱/手机号');
            return;
        }
        if (password == '') {
            mui.toast('请输入密码');
            return;
        }

        parent.Tools.toast("登录中...");
        parent.UserManager.login({
            data: {
                username: username,
                password: password
            },
            error: (req, err, expected) => {
                mui.toast('服务器或网络错误，请检查网络后重试');
            },
            success: (data, text) => {
                if (data.username) {
                    parent.mui.toast('登录成功');
                    parent.PageManager.open('pages/index.html');
                } else if (data == 'no user' || data == 'password error') {
                    mui.toast('用户名或密码错误，请检查后重试')
                }
            },
            complete: () => {
                parent.Tools.closeToast();
            }
        })
    });
};
