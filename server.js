var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server = http.createServer(function (req,res) {
    var urlObj = url.parse(req.url,true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /\.([0-9a-zA-Z]+)/i;
    if(reg.test(pathname)){
        var conFile = null,
            status = 200;
        try{
            conFile = fs.readFileSync('.'+pathname);
        }catch (e){
            conFile = 'not found';
            status = 404;
        }
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
        }
        res.writeHead(status,{'content-type':suffixMIME});
        res.end(conFile);
        return;
    }
    var result = {code:1,msg:'error',data:null},
        path = './json/custom.json',
        customList = JSON.parse(fs.readFileSync(path));
    if(pathname == '/getAllList'){
        if(customList.length>0){
            result = {
                code:0,
                msg:'success',
                data:customList
            }
        }
        res.writeHead(200,{'content-type':'application/json'});
        res.end(JSON.stringify(result));
        return;
    }
    if(pathname == '/getInfo'){
        var customId = query['id'];
        customList.forEach(function (item,index) {
           if(item['id'] == customId){
               result = {
                   code:0,
                   msg:'success',
                   data:item
               }
           }
        });
        res.writeHead(200,{'content-type':'application/json'});
        res.end(JSON.stringify(result));
        return;
        }
    if(pathname == '/removeInfo'){
        customId = query['id'];
        customList.forEach(function (item,index) {
            if(item['id'] == customId){
                customList.splice(index,1);
                fs.writeFileSync(path,JSON.stringify(customList));
                result = {
                    code:0,
                    msg:'success'
                }
            }
        });
        res.writeHead(200,{'content-type':'application/json'});
        res.end(JSON.stringify(result));
        return;
    }
    if(pathname == '/addInfo'){
        var pass = "";
        req.on('data',function (chunk) {
            pass += chunk;
        });
        req.on('end',function () {
            pass = pass.myQueryURL();
            var maxId = customList.length ===0 ? 0 : parseFloat(customList[customList.length-1]['id']);
            pass['id'] = maxId + 1;
            customList.push(pass);
            fs.writeFileSync(path,JSON.stringify(customList));
            result = {
                code:0,
                msg:'success'
            };
            res.writeHead(200,{'content-type':'application/json'});
            res.end(JSON.stringify(result));
        });
        return;
    }
    if(pathname == '/updateInfo'){
         pass = "";
        req.on('data',function (chunk) {
            pass += chunk;
        });
        req.on('end',function () {
            pass = pass.myQueryURL();
            customList.forEach(function (item,index) {
                if(item['id'] == pass['id']){
                    customList[index] = pass;
                }
            });
            fs.writeFileSync(path,JSON.stringify(customList));
            result = {
                code:0,
                msg:'success'
            };
            res.writeHead(200,{'content-type':'application/json'});
            res.end(JSON.stringify(result));
        });
        return;
    }
    res.writeHead(404,{'content-type':'text/plain'});
    res.end('bad url');
});
String.prototype.myQueryURL = function () {
    var regB = /([^&#?=]+)=([^&#?=]+)/g;
    var obj = {};
    this.replace(regB,function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
};
server.listen(41,function () {
    console.log('ok 41');
});
