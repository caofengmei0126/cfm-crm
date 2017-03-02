;(function () {
    function check(url) {
        return url.indexOf('?')>-1 ? "&" : "?";
    }
    function toStr(obj) {
        var str = "";
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                str += key+"="+obj[key]+"&";
            }
        }
         str.substring(0,str.length-1);
        return str;
    }
   function ajax(option) {
       var _default = {
           url:null,
           async:true,
           cache:true,
           method:'get',
           data:null,
           dataType:"json",
           success:null,
           error:null
       };
       for(var key in option){
           if(option.hasOwnProperty(key)){
               if(key == 'type'){
                   _default['method'] = option['type'];
               }
               _default[key] = option[key];
           }
       };
       var xhr = new XMLHttpRequest();
       var reg = /^(get|delete|head)$/i;
       if(_default.data){
           if(typeof _default.data == 'object'){
               _default.data = toStr(_default.data);
           };
           if(reg.test(_default.method)){
               _default.url += check(_default.url)+_default.data;
               _default.data = null;
           }
       };
       if(reg.test(_default.method) && _default.cache == false){
           _default.url += check(_default.url)+'_='+Math.random();
       }
       xhr.open(_default.method,_default.url,_default.async);
       xhr.onreadystatechange = function () {
           if(/^(2|3)\d{2}$/.test(xhr.status)){
               if(xhr.readyState === 4){
                   var result = xhr.responseText;
                   switch (_default.dataType.toUpperCase()){
                       case 'JSON':
                           result = 'JSON' in window ? JSON.parse(result) : eval("("+result+")");
                           break;
                       case 'XML':
                           result = xhr.responseXML;
                           break;
                   }
                   _default.success && _default.success.call(xhr,result);
               }
            return;
           }
           _default.error && _default.error.call(xhr);
       };
       xhr.send(_default.data);
   }
   window.ajax = ajax;
})();



















