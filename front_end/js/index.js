window.onload = function() {
    mui.init({
        swipeBack: false,
        statusBarBackground: 'darkcyan'
    });
    mui('.mui-scroll-wrapper').scroll();

    // 初始化：用户相关
    if (parent.UserManager.isLogin()) {
        if (parent.UserManager.userInfo.avatar)
            $("#user-photo").css("background-image", "url(" + parent.UserManager.userInfo.avatar + ")");
        else
            parent.UserManager.get_user_avatar({
                data: {
                    username: parent.UserManager.userInfo.username
                },
                success: (data) => {
                    if (data.picture) {
                        parent.UserManager.userInfo.avatar = "data:image/png;base64," + data.picture;
                        $("#user-photo").css("background-image", "url(" + parent.UserManager.userInfo.avatar + ")");
                    }
                }
            })
        $("#user-name").text(parent.UserManager.userInfo.username);
        $("#sign-control").css("display", "none");
        $("#logout-control").css("display", "block");
    } else {
        $("#sign-control").css("display", "block");
        $("#logout-control").css("display", "none");
    }

    // 侧滑菜单按钮事件
    $('#logout-button').bind(parent.tap, (event) => {
        // 登出操作
        var outBtn = $('#logout-button')[0];
        if (outBtn.textContent == "") return;
        parent.Tools.toast("登出中", {
            duration: 4000
        });
        outBtn.style.backgroundImage = "url('../resources/loading.png')";
        outBtn.textContent = "";
        parent.UserManager.logout({
            complete: () => {
                $("#sign-control").css("display", "block");
                $("#logout-control").css("display", "none");
                outBtn.style.backgroundImage = "";
                outBtn.textContent = "登出";
                parent.Tools.closeToast();
                mui.toast('您已登出');
                $('iframe')[0].setAttribute("src", 'index-mine.html');
                mui('.mui-off-canvas-wrap').offCanvas().close();
            }
        });
    });
    $('#logout-control div').bind(parent.tap, (event) => {
        // 跳转个人
        parent.PageManager.values = parent.UserManager.userInfo;
        parent.PageManager.open('pages/personalCenter.html');
    });
    $('.sign-in').bind(parent.tap, (event) => {
        // 登录
        parent.PageManager.open('pages/signIn.html');
    });
    $('.sign-up').bind(parent.tap, (event) => {
        // 注册
        parent.PageManager.open('pages/signUp.html');
    });

    // 切换列表种类
    // TODO
    $('#like-title span').bind(parent.tap, (event) => {
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
    $('.mui-action-menu').bind(parent.tap, (event) => {
        mui('.mui-off-canvas-wrap').offCanvas().show();
    });

    // 音乐控件
    parent.AudioManager.init($('#play-nav')[0], $('#play-nav-queue')[0]);
    
    $("iframe")[0].setAttribute("src", "index-mine.html");
};
