window.onload = function() {
    mui.init({
        swipeBack: false
    });
    mui('.mui-scroll-wrapper').scroll();

    $('.nav-back').bind('click', parent.PageManager.reBack);

    $("#confirm").css("display", "none");
    parent.UserManager.get_all_avatar({
        error: () => {
            console.log("网络异常，请稍后重试");
        },
        success: (data) => {
            if (data.pictures) {
                $("#avatar-list ul").empty();
                for (var i = 0; i < data.pictures.length; i++) {
                    id = data.pictures[i].avatar_num;
                    base64Str = "data:image/png;base64," + data.pictures[i].avatar_picture;
                    $("#avatar-list ul").append(
                        '<li class="avatar" id=' + id +
                        ' style = "background-image: url(' + base64Str + ')" ></li>'
                    )
                }
                $(".avatar").bind(parent.tap, (event) => {
                    $("#confirm").css("display", "block");
                    $(".avatar-active").removeClass("avatar-active");
                    $(event.currentTarget).addClass("avatar-active");
                });
            }
        }
    });
    $("#confirm").bind(parent.tap, () => {
        parent.Tools.toast("修改中...")
        parent.UserManager.change_avatar({
            data: {
                number: $(".avatar-active")[0].id
            },
            error: () => {
                console.log("网络异常，请重试")
            },
            success: (data) => {
                if (data == "ok") {
                    parent.mui.toast("修改成功");
                    parent.PageManager.reBack()
                } else {
                    mui.toast("修改失败")
                }
            },
            complete: () => {
                parent.Tools.closeToast();
            }
        })
        console.log($(".avatar-active")[0].id)
    })
}
