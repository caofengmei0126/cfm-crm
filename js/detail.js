var userName = document.getElementById('userName'),
    submit = document.getElementById('submit');
String.prototype.myQueryURL = function () {
    var regB = /([^&#?=]+)=([^&#?=]+)/g;
    var obj = {};
    this.replace(regB,function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
};
var urlObj = window.location.href.myQueryURL();
ajax({
    url:'/getInfo',
    method:'get',
    cache:false,
    data:{
        id:urlObj['id']
    },
    success:function (result) {
        if(result && result.code === 0){
            userName.value = result.data.name;
        }
    }
});
submit.onclick = function () {
    var value = userName.value;
    if(typeof urlObj['id']!=='undefined'){
        ajax({
            url:'/updateInfo',
            method:'post',
            data:{
                id:urlObj['id'],
                name:value
            },
            success:function (result) {
                if(result && result.code === 0){
                    window.location.href = 'index.html';
                    alert('修改成功');
                }else {
                    alert('修改失败');
                }
            }
        });
        return;
    }
    ajax({
        url:'/addInfo',
        method:'post',
        data:{
            name:value
        },
        success:function (result) {
            if(result && result.code ===0){
                window.location.href = 'index.html';
                alert('添加成功');
            }else {
                alert('添加失败');
            }
        }
    })
};
