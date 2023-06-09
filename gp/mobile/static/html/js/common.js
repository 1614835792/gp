// 提示框 
function $alert(content){
    $mask = $('<div class="alert-mask animated fadeIn"><span>' + content + '</span></div>');
    $("body").append($mask);

    var timer = setTimeout(function(){
        $(".alert-mask").removeClass("fadeIn").addClass("fadeOut");
        clearTimeout(timer);
        timer = null;
        
        var timer = setTimeout(function(){
            $(".alert-mask").remove();
            clearTimeout(timer);
            timer = null;
        },800);         
    },1000)
} 


// 加载中loading 显示 
function showLoading(){
    $loading = $('<div class="loading-mask animated fadeIn"><div class="loading"><span></span><span></span><span></span><span></span><span></span></div></div>');
    $("body").append($loading).css("overflow" , "hidden");
}


// 加载中loading 隐藏 
function hideLoading(){
    $(".loading-mask").addClass('fadeOut');
    var timer = setTimeout(function(){
        $(".loading-mask").remove();
        $("body").css("overflow" , "auto"); 
        clearTimeout(timer);
        timer = null;  
    },1000);
}


// $ajax 二次封装 
function $ajaxCustom(_url, _data, _succ) {
    $.ajax({
        url: _url,
        type: "POST",
        data: _data,
        dataType: "json",
        success: _succ,
        error: function(xhr) {
            if(422 == xhr.status){
                var resp = JSON.parse(xhr.responseText);
                $alert(resp.message);
            }else{
                // $alert("系统错误！");
            }
            return false;
        }
    });
    return false;
}

//token过期处理
function refreshTocken(callback){
    var storage = window.localStorage; 
    var token = storage.token;
    var url = config.api.base + config.api.refreshTocken;
    $ajaxCustom(url, {_tk : token}, function(res){
        if(res.code == 0){
            storage.token = res.data.token;
            storage.expire = res.data.expire;
            callback();
        }else if(res.code == 30004){
            storage.removeItem("token");
            window.location.href = './login.html';
        }else{
            $alert(res.message);
        }
    });
}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
// 获取页面参数
function getQueryVariable(variable)
        {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
            return(false);
        }

function  sinaAjax( code, callback ){
    var _code = code;
    if( _code == undefined ){
        return false;
    }
     _code =  _code.split(",");
     var empCode = [];
     for( var key in _code ){
        if( isNaN( _code[key] ) ){
            empCode.push( _code[key] )
        }
     }
     code = empCode.join(",");


    // window.localStorage.isCanLoad = true;
    var isCanLoad = window.localStorage.isCanLoad;
    if( isCanLoad || isCanLoad == undefined ){
        $.ajax({
            url:"https://qt.gtimg.cn/q=" + code,
            dataType: "script",
            cache: "false",
            type: "GET",
            timeout : 1000,
           success: function(){
                            var res = {};
                            res.state = true;
                            res.data = new Array();
                            var codeArray = code.split(",");
                            for(var key in codeArray){
								if(!codeArray[key] || 'undefined' == codeArray[key]){
									return;
								}
                                var codeInfo = eval( "v_" + codeArray[key] );
                                 codeInfo = codeInfo.split("~");
                                var dataObj = {};
                                dataObj.code = codeArray[key].slice(2);
                                dataObj.fullCode = codeArray[key];
                                dataObj.prod_name = codeInfo[1];
								// 当前价格
                                dataObj.last_px = (parseFloat( codeInfo[3] )).toFixed(2);
								// 今开
                                dataObj.open_px = (parseFloat( codeInfo[5] )).toFixed(2);
								// 昨收
                                dataObj.preclose_px = (parseFloat( codeInfo[4] )).toFixed(2);
								// 最高
                                dataObj.high_px = (parseFloat( codeInfo[33] )).toFixed(2);
								// 最低
                                dataObj.low_px = (parseFloat( codeInfo[34] )).toFixed(2);
                                // dataObj.px_change = (codeInfo[3] - codeInfo[2] ).toFixed(2);
                                // 涨跌
                                dataObj.px_change = ( parseFloat ( codeInfo[31] ) ).toFixed(2);

                                // dataObj.px_change_rate = ( (codeInfo[3] - codeInfo[2] ) / codeInfo[2] * 100 ).toFixed(2);
								//  涨跌%
                                dataObj.px_change_rate = ( parseFloat( codeInfo[32] ) ).toFixed(2);
                                // 成交量（手）  
                                dataObj.buy_px = (parseFloat( codeInfo[6] )).toFixed(2);
                                // dataObj.sell_px = (parseFloat( codeInfo[7] )).toFixed(2);
								// 卖一
                                dataObj.sell_px = ( parseFloat ( codeInfo[19] ) ).toFixed(2);
								// 外盘
								dataObj.out_business_amount = (parseFloat( codeInfo[7] )).toFixed(2);
                                // 内盘 
                                dataObj.business_amount = (parseFloat( codeInfo[8] )).toFixed(2);
								// 买一 
                                dataObj.business_balance = (parseFloat( codeInfo[9] )).toFixed(2);
								// 振幅
                                dataObj.amplitude = (parseFloat( codeInfo[43] )).toFixed(2);
								
								// 成交额
								dataObj.turn_volume = (parseFloat( codeInfo[37] )).toFixed(2);
								
								// 总市值
								dataObj.total_value = (parseFloat( codeInfo[45] )).toFixed(2)
																
								// 流通市值
								dataObj.circulation_market_value = (parseFloat( codeInfo[44] )).toFixed(2)
								
                                res.data.push( dataObj );
                            }
                            callback( res );
            
            },
            //调用执行后调用的函数
            complete: function (XMLHttpRequest, textStatus) {
                if(textStatus == 'timeout'){
                    window.localStorage.isCanLoad = false;
                    $.ajax({
                        url:"http://web.sqt.gtimg.cn/q=" + code + "?r=" + Math.random(),
                        dataType: "script",
                        cache: "false",
                        type: "GET",
                        success: function(){
                            var res = {};
                            res.state = true;
                            res.data = new Array();
                            var codeArray = code.split(",");
                            for(var key in codeArray){
								if(!codeArray[key] || 'undefined' == codeArray[key]){
									return;
								}
                                var codeInfo = eval( "v_" + codeArray[key] );
                                 codeInfo = codeInfo.split("~");
                                var dataObj = {};
                                dataObj.code = codeArray[key].slice(2);
                                dataObj.fullCode = codeArray[key];
                                dataObj.prod_name = codeInfo[1];
                                dataObj.last_px = (parseFloat( codeInfo[3] )).toFixed(2);
                                dataObj.open_px = (parseFloat( codeInfo[5] )).toFixed(2);
                                dataObj.preclose_px = (parseFloat( codeInfo[4] )).toFixed(2);
                                dataObj.high_px = (parseFloat( codeInfo[33] )).toFixed(2);
                                dataObj.low_px = (parseFloat( codeInfo[34] )).toFixed(2);
                                // dataObj.px_change = (codeInfo[3] - codeInfo[2] ).toFixed(2);

                                dataObj.px_change = ( parseFloat ( codeInfo[31] ) ).toFixed(2);

                                // dataObj.px_change_rate = ( (codeInfo[3] - codeInfo[2] ) / codeInfo[2] * 100 ).toFixed(2);
                                dataObj.px_change_rate = ( parseFloat( codeInfo[32] ) ).toFixed(2);

                                dataObj.buy_px = (parseFloat( codeInfo[6] )).toFixed(2);
                                // dataObj.sell_px = (parseFloat( codeInfo[7] )).toFixed(2);
                                dataObj.sell_px = ( parseFloat ( codeInfo[19] ) ).toFixed(2);

                                dataObj.business_amount = (parseFloat( codeInfo[8] )).toFixed(2);
                                dataObj.business_balance = (parseFloat( codeInfo[9] )).toFixed(2);
                                dataObj.amplitude = (parseFloat( codeInfo[3] )).toFixed(2);
                                res.data.push( dataObj );
                            }
                            callback( res );
                        }
                    });
                }
            },
            error : function(xhr,textStatus){
                
            }
        });
    }else{
        $.ajax({
            url:"http://web.sqt.gtimg.cn/q=" + code + "?r=" + Math.random(),
            dataType: "script",
            cache: "false",
            type: "GET",
            success: function(){
                var res = {};
                res.state = true;
                res.data = new Array();
                var codeArray = code.split(",");
                for(var key in codeArray){
					if(!codeArray[key] || 'undefined' == codeArray[key]){
						return;
					}
                    var codeInfo = eval( "v_" + codeArray[key] );
                     codeInfo = codeInfo.split("~");
                    var dataObj = {};
                    dataObj.code = codeArray[key].slice(2);
                    dataObj.fullCode = codeArray[key];
                    dataObj.prod_name = codeInfo[1];
                    dataObj.last_px = (parseFloat( codeInfo[3] )).toFixed(2);
                    dataObj.open_px = (parseFloat( codeInfo[5] )).toFixed(2);
                    dataObj.preclose_px = (parseFloat( codeInfo[4] )).toFixed(2);
                    dataObj.high_px = (parseFloat( codeInfo[33] )).toFixed(2);
                    dataObj.low_px = (parseFloat( codeInfo[34] )).toFixed(2);
                    // dataObj.px_change = (codeInfo[3] - codeInfo[2] ).toFixed(2);

                    dataObj.px_change = ( parseFloat ( codeInfo[31] ) ).toFixed(2);

                    // dataObj.px_change_rate = ( (codeInfo[3] - codeInfo[2] ) / codeInfo[2] * 100 ).toFixed(2);
                    dataObj.px_change_rate = ( parseFloat( codeInfo[32] ) ).toFixed(2);

                    dataObj.buy_px = (parseFloat( codeInfo[6] )).toFixed(2);
                    // dataObj.sell_px = (parseFloat( codeInfo[7] )).toFixed(2);
                    dataObj.sell_px = ( parseFloat ( codeInfo[19] ) ).toFixed(2);

                    dataObj.business_amount = (parseFloat( codeInfo[8] )).toFixed(2);
                    dataObj.business_balance = (parseFloat( codeInfo[9] )).toFixed(2);
                    dataObj.amplitude = (parseFloat( codeInfo[3] )).toFixed(2);
                    res.data.push( dataObj );
                }
                callback( res );
            }
        });
    }
}













