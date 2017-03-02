
var crm = (function () {
    var content = document.getElementById('content');
    function bindData(result) {
        var str = ``;
        for(var i = 0,len = result.data.length;i<len;i++){
            var cur = result.data[i];
            str+=`<li>
            <span>${cur.id}</span>
            <span>${cur.name}</span>
            <span>
                <a href="detail.html?id=${cur.id}">修改</a>
                <a href="javascript:;" data-id="${cur.id}">删除</a>
            </span>
        </li>`
        }
        content.innerHTML = str;
    }
    function bindEvent() {
        content.onclick = function (e) {
            e = e || window.event;
            var tar = e.target || e.srcElement;
            if(tar.tagName.toUpperCase()=='A'&&tar.innerHTML == '删除'){
                var tarId = tar.getAttribute('data-id');
                var flag = window.confirm('确定要删除编号为['+tarId+']的信息吗？');
                if(flag){
                    ajax({
                        url:'/removeInfo',
                        method:'get',
                        cache:false,
                        data:{
                            id:tarId
                        },
                        success:function (result) {
                            if(result && result.code === 0){
                                content.removeChild(tar.parentNode.parentNode);
                                alert('删除成功');
                            }else {
                                alert('删除失败');
                            }
                        }
                    })
                }
            }
        }
    }
    return {
        init: function () {
            ajax({
                url: '/getAllList',
                method: 'get',
                cache: false,
                success: function (result) {
                    if (result && result.code === 0) {
                        bindData(result);
                        bindEvent();
                    }
                }
            })
        }
    }
})();
crm.init();

