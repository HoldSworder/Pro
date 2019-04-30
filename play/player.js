Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return fmt;
};

function S4() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}

function NewGuid() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4();
}

$(document).ready(function () {
    //节目信息
    var program = null;
    //节目播放开始时间
    var startTime = null;
    //节目已播放时间
    var palyTime = null;
    //界面总时长
    var timelong = 0;
    //正在播放的节目
    var playerList = [];
    //是否播放节目
    var started = null;
    //播放面板高度
    var height = 450.00;
    //播放面板宽度
    var width = 800.00;

    //HH:mm:ss转毫秒
    function timeToMsec(time) {
        var timeArr = time.split(":");
        return timeArr[0] * 3600000 + timeArr[1] * 60000 + timeArr[2] * 1000;
    }

    //毫秒转HH:mm:ss
    function msecToTime(msec) {
        //获取播放分钟
        var hour = parseInt(msec / 3600000);
        //获取播放分钟
        var min = parseInt(msec % 3600000 / 60000);
        //获取播放秒数
        var second = parseInt(msec % 60000 / 1000);
        return (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + ":" + (second < 10 ? "0" : "") + second;
    }

    //计算节目缩放比
    function scaleVal() {
        //节目相对于播放面板的缩放比例
        var scaleVal = 1;
        //节目大小与播放面板大小一致
        if (program.width == width && program.height == height) {
            return scaleVal;
        }
        //根据高度计算缩放比
        scaleVal = (height / program.height);
        //按高度缩放的的宽度
        scaleValWidth = program.width * scaleVal;
        //按缩放比修改后宽度大于播放面板宽度，就按宽度缩放比例
        if (scaleValWidth > width) {
            //根据宽度计算缩放比例  
            scaleVal = (width / program.width);
        }
        return scaleVal;
    }

    //图片素材
    function imageHtml(element) {
        var html = "<image id='_id' style='width:_width;height:_height;" +
            "position:absolute;top:_top;left:_left' src='_src' ></image>";
        html = html.replace("_id", element.id);
        html = html.replace("_src", "/files/idm/" + program.areaId + "/" + element.elementName); //图片文件路径
        html = html.replace("_width", element.width + "px");
        html = html.replace("_height", element.height + "px");
        html = html.replace("_top", element.location_y + "px");
        html = html.replace("_left", element.location_x + "px");
        console.log(html);
        return html;
    }

    //视频素材
    function videoHtml(element) {
        var html = "<video id='_id' src='_src' _muted loop='loop' autoplay='autoplay' " +
            "style='position:absolute;width:_width;" +
            "height:_height;top:_top;left:_left'></video>";
        html = html.replace("_id", element.id);
        html = html.replace("_src", "/files/idm/" + program.areaId + "/" + element.elementName); //视频文件路径
        html = html.replace("_width", element.width + "px");
        html = html.replace("_height", element.height + "px");
        html = html.replace("_top", element.location_y + "px");
        html = html.replace("_left", element.location_x + "px");
        if (element.volume == 0) {
            html = html.replace("_muted", "muted"); //静音
        } else {
            html = html.replace("_muted", ""); //不设置音量
        }
        console.log(html);
        return html;
    }

    //文字素材
    function fontHtml(element) {
        var html = "<div id='_id' style='position:absolute;width:_width;height:_height;" +
            "top:_top;left:_left;word-break=_word-break;" +
            "text-align:_text-align;font-family:_font-family;font-size:_font-size;" +
            "color:_color;background-color:_backgroundcolor;" +
            "opacity:_opacity;font-style:_font-style;font-weight:_font-weight;" +
            "letter-spacing:_letter-spacing;line-height:_line-height'>_content</div>";
        html = html.replace("_id", element.id);
        html = html.replace("_width", element.width + "px");
        html = html.replace("_height", element.height + "px");
        html = html.replace("_top", element.location_y + "px");
        html = html.replace("_left", element.location_x + "px");
        if (element.multiline) {
            html = html.replace("_word-break", "break-all"); //多行显示
        } else {
            html = html.replace("_word-break", "normal");
        }
        var alignment = "left";
        if (element.alignment == 1) {
            alignment = "center";
        } else if (element.alignment == 2) {
            alignment = "right";
        }
        html = html.replace("_text-align", alignment); //字体对齐方式
        html = html.replace("_font-family", element.font); //字体
        html = html.replace("_font-size", element.size + "px"); //字体大小
        html = html.replace("_color", element.color); //字体颜色
        html = html.replace("_backgroundcolor", element.backgroundcolor); //背景颜色
        html = html.replace("_opacity", element.transparency); //透明度
        if (element.bold) {
            html = html.replace("_font-weight", "bold"); //粗体
        } else {
            html = html.replace("_font-weight", "normal");
        }
        if (element.italic) {
            html = html.replace("_font-style", "italic"); //斜体
        } else {
            html = html.replace("_font-style", "normal");
        }
        html = html.replace("_letter-spacing", element.wordSpace + "px"); //字体间距
        html = html.replace("_line-height", element.rowSpace + "px"); //设置行高

        html = html.replace("_content", element.text); //文字内容
        console.log(html);
        return html;
    }

    //音频文件
    function audioHtml(element) {
        var html = "<audio id='_id'  autoplay='autoplay' src='_src'></audio>";
        html = html.replace("_id", element.id);
        html = html.replace("_src", "/files/idm/" + program.areaId + "/" + element.elementName);
        console.log(html);
        return html;
    }

    //文档素材
    function wordHtml(element, index) {
        var html = "<image id='_id' style='width:_width;height:_height;" +
            "position:absolute;top:_top;left:_left' src='_src' ></image>";
        html = html.replace("_id", element.id);
        html = html.replace("_src", "/files/idm/" + program.areaId + "/" +
            element.elementName + "/" + element.imageList[index]); //文档图片路径
        html = html.replace("_width", element.width + "px");
        html = html.replace("_height", element.height + "px");
        html = html.replace("_top", element.location_y + "px");
        html = html.replace("_left", element.location_x + "px");
        console.log(html);
        return html;
    }

    //rtsp 不支持播放
    function rtspHtml(element) {
        var html = "<div id='_id'style='position:absolute;width:_width;height:_height;" +
            "top:_top;left:_left;'>_text</div>";
        html = html.replace("_id", "不支持播放");
        html = html.replace("_text", element.text); //要显示的内容
        html = html.replace("_width", element.width + "px");
        html = html.replace("_height", element.height + "px");
        html = html.replace("_top", element.location_y + "px");
        html = html.replace("_left", element.location_x + "px");
        console.log(html);
        return html;
    }

    //网页播放
    function iFrameHtml(element) {
        var html = "<iframe id='_id' style='width:_width;height:_height;" +
            "position:absolute;top:_top;left:_left;' src='_src'   scrolling='_scrolling'></iframe>";
        html = html.replace("_id", element.id);
        html = html.replace("_src", element.url); //网页路径
        html = html.replace("_width", element.width + "px");
        html = html.replace("_height", element.height + "px");
        html = html.replace("_top", element.location_y + "px");
        html = html.replace("_left", element.location_x + "px");
        if (element.overflow == 1) {
            html = html.replace("_scrolling", "no");
        }
        console.log(html);
        return html;
    }

    //数字时钟
    function clockHtml(element) {
        var html = null;
        html = "<div id='_id'style='position:absolute;width:_width;height:_height;" +
            "top:_top;left:_left;" +
            "text-align:_text-align;font-family:_font-family;font-size:_font-size;" +
            "color:_color;background-color:_backgroundcolor;" +
            "opacity:_opacity;font-style:_font-style;font-weight:_font-weight;'>_content</div>";
        html = html.replace("_id", element.id);
        html = html.replace("_content", (new Date()).format(element.format)); //显示当前时间
        html = html.replace("_width", element.width + "px");
        html = html.replace("_height", element.height + "px");
        html = html.replace("_top", element.location_y + "px");
        html = html.replace("_left", element.location_x + "px");
        var alignment = "left";
        if (element.alignment == 1) {
            alignment = "center";
        } else if (element.alignment == 2) {
            alignment = "right";
        }
        html = html.replace("_text-align", alignment); //字体对齐方式
        html = html.replace("_font-family", element.font); //字体
        html = html.replace("_font-size", element.size + "px"); //字体大小
        html = html.replace("_color", element.color); //字体颜色
        html = html.replace("_backgroundcolor", element.backgroundcolor); //背景颜色
        html = html.replace("_opacity", element.transparency); //透明度
        if (element.bold) {
            html = html.replace("_font-weight", "bold"); //粗体
        } else {
            html = html.replace("_font-weight", "normal");
        }
        if (element.italic) {
            html = html.replace("_font-style", "italic"); //斜体
        } else {
            html = html.replace("_font-style", "normal");
        }
        // html = html.replace("_line-height", element.height + "px");   //设置行高

        console.log(html);
        return html;
    }

    //天气
    function weatherHtml(element) {
        var html = null;
        html = "<div id='_id'style='position:absolute;width:_width;height:_height;" +
            "top:_top;left:_left;" +
            "text-align:_text-align;font-family:_font-family;font-size:_font-size;" +
            "color:_color;background-color:_backgroundcolor;" +
            "font-style:_font-style;font-weight:_font-weight;" +
            "letter-spacing:_letter-spacing;'>_content</div>";
        html = html.replace("_id", element.id);
        var text = "";
        //显示天气-测试数据
        if (element.weather) {
            text = text + "晴天";
        }
        //显示温度-测试数据
        if (element.temperature) {
            text = text + " 8℃~20℃";
        }
        //显示风力-测试数据
        if (element.windPower) {
            text = text + " 北风4-5级";
        }
        html = html.replace("_content", text); //显示当前时间
        html = html.replace("_width", element.width + "px");
        html = html.replace("_height", element.height + "px");
        html = html.replace("_top", element.location_y + "px");
        html = html.replace("_left", element.location_x + "px");
        var alignment = "left";
        if (element.alignment == 1) {
            alignment = "center";
        } else if (element.alignment == 2) {
            alignment = "right";
        }
        html = html.replace("_text-align", alignment); //字体对齐方式
        html = html.replace("_font-family", element.font); //字体
        html = html.replace("_font-size", element.size + "px"); //字体大小
        html = html.replace("_color", element.color); //字体颜色
        html = html.replace("_backgroundcolor", element.backgroundcolor); //背景颜色
        html = html.replace("_opacity", element.transparency); //透明度
        if (element.bold) {
            html = html.replace("_font-weight", "bold"); //粗体
        } else {
            html = html.replace("_font-weight", "normal");
        }
        if (element.italic) {
            html = html.replace("_font-style", "italic"); //斜体
        } else {
            html = html.replace("_font-style", "normal");
        }
        console.log(html);
        return html;
    }

    //表格元素
    function tableHtml(element) {
        var html = "<table class=_class id='_id'>";
        html = html.replace("_id", element.id);
        //默认表格样式
        if (element.styleId == 0) {
            html = html.replace("_class", "tableDefault");
        }
        //生成表格
        for (var i = 0; i < element.rowList.length; i++) {
            html = html + "<tr>";
            for (var j = 0; j < element.rowList[i].cellList.length; j++) {
                html = html + (i == 0 ? "<th>" : "<td>");
                html = html + "<div style=" +
                    "text-align:_text-align;font-family:_font-family;font-size:_font-size;" +
                    "color:_color;background-color:_backgroundcolor;" +
                    "font-style:_font-style;font-weight:_font-weight;'>_content</div>";
                html = html.replace("_content", element.rowList[i].cellList[j].text); //单元格中内容
                var alignment = "left";
                if (element.alignment == 1) {
                    alignment = "center";
                } else if (element.alignment == 2) {
                    alignment = "right";
                }
                html = html.replace("_text-align", alignment); //字体对齐方式
                html = html.replace("_font-family", element.font); //字体
                html = html.replace("_font-size", element.size + "px"); //字体大小
                html = html.replace("_color", element.color); //字体颜色
                html = html.replace("_backgroundcolor", element.backgroundcolor); //背景颜色
                html = html.replace("_opacity", element.transparency); //透明度
                if (element.bold) {
                    html = html.replace("_font-weight", "bold"); //粗体
                } else {
                    html = html.replace("_font-weight", "normal");
                }
                if (element.italic) {
                    html = html.replace("_font-style", "italic"); //斜体
                } else {
                    html = html.replace("_font-style", "normal");
                }
                html = html + (i == 0 ? "</th>" : "</td>")
            }
            html = html + "</tr>";
        }
        html = html + "</table>";
        console.log(html);
        return html;
    }

    //http数据源
    function httpDataSource(element) {
        //启用定时器获取数据
        setInterval(function () {
            $.ajax({
                url: element.address,
                dataType: "json",
                type: "post",
                success: function (result) {
                    for (var i = 0; i < playerList.length; i++) {
                        var element1 = playerList[i];
                        //文本控件绑定数据源(必须是文本对象)
                        if (element1.elementType == 4 && element1.dataSourceName == element.dataSourceName) {
                            //更新文本控件内容
                            $("#" + element1.id).text(result[element1.dataPropertyName]);
                        }
                        //表格控件绑定数据源(必须是数组)
                        if (element1.elementType == 6 && element1.dataSourceName == element.dataSourceName) {
                            //获取数据数组
                            var dataArr = result[element1.dataPropertyName];
                            //循环填充数据到表格中
                        }
                        //图片控件绑定数据源(必须是文本对象)
                        if (element1.elementType == 4 && element1.dataSourceName == element.dataSourceName) {
                            //设置图片路径
                            $("#" + element.id).attr("src", result[element1.dataPropertyName]);
                        }
                    }
                }
            });
        }, element.interval);
    }

    //点击节目预览
    function player(element) {
        console.log(program)
        //播放器高度
        $("#player").css("height", program.height);
        //播放器宽度
        $("#player").css("width", program.width);
        //缩放比例
        var varscaleVal = scaleVal(program);
        //播放器缩放比例
        $('#player').css('transform', "scale(" + varscaleVal + ", " + varscaleVal + ")");
        //缩放基点
        $('#player').css('transform-origin', "0 0");
        //以节目缩略图做背景
        $("#player").css("background-image", "url(" + program.thumbnail + ")");
        //显示节目播放界面
        $("#playerModal").show();

    };

    //事件初始化
    function init() {
        //关闭预览 
        $(".player-close").on("click", function () {
            //结束预览
            $("#playerModal").hide();
        });
        //开始播放
        $("#start").on("click", function () {
            //开始播放时间
            startTime = new Date().getTime();
            //移除背景图片
            $("#player").css("background-image", "url()");
            //设置节目背景颜色
            $("#player").css("backgroundColor", program.backgroundColor);
            //计算节目时长 毫秒
            timelong = timeToMsec(program.duration);
            $("#time").val("00:00:00");
            //定时检查节目
            started = true;
            setTimeout(check, 100);
            //数据源处理
            if (program.dataSourceList != null) {
                var dataSource = null;
                for (var i = 0; i < program.dataSourceList.length; i++) {
                    httpDataSource(program.dataSourceList[i]);
                }
            }
        });
    }

    //播放元素
    function playerElement(element) {
        //判断当前节目是否已经在播放
        if ($("#" + element.id).size() > 0) {
            return;
        }
        //图片素材播放
        if (element.elementType == 1) {
            $("#player").append(imageHtml(element));
            playerList.push(element);
        }
        //视频素材播放
        else if (element.elementType == 2) {
            $("#player").append(videoHtml(element));
            playerList.push(element);
        }
        //音频素材播放
        else if (element.elementType == 3) {
            $("#player").append(audioHtml(element));
            playerList.push(element);
        }
        //文本素材播放
        else if (element.elementType == 4) {
            $("#player").append(fontHtml(element));
            playerList.push(element);
            //单行滚动
            if (element.rolling != 0) {
                var rolling = null;
                //获取滚动方向
                if (element.rolling == 1) {
                    rolling = "left";
                } else if (element.rolling == 2) {
                    rolling = "right";
                } else if (element.rolling == 3) {
                    rolling = "up"
                } else if (element.rolling == 4) {
                    rolling = "down"
                }
                $('#' + element.id).addClass("dowebok");
                $('#' + element.id).liMarquee({
                    //滚动的速度，毫秒单位
                    scrollamount: element.playbackspeed,
                    //每次重复之前的延迟量。 
                    scrolldelay: element.residencetime,
                    //滚动方向
                    direction: rolling,
                });
            }
        }
        //rtsp
        else if (element.elementType == 5) {
            $("#player").append(rtspHtml(element));
            playerList.push(element);
        }
        //表格播放
        else if (element.elementType == 6) {
            $("#player").append(tableHtml(element));
            playerList.push(element);
        }
        //时钟
        else if (element.elementType == 7) {
            $("#player").append(clockHtml(element));
            playerList.push(element);
        }
        //天气
        else if (element.elementType == 8) {
            $("#player").append(weatherHtml(element));
            playerList.push(element);
        }
        //网页
        else if (element.elementType == 9) {
            $("#player").append(iFrameHtml(element));
            playerList.push(element);
        }
        //文档
        else if (element.elementType == 10) {
            $("#player").append(wordHtml(element), 0);
            //记录播放图片的索引
            element.playerIndex = 0;
            //记录播放图片的名称
            element.playerName = element.imageList[0];
            //记录播放时间 
            element.playerTime = new Date().getTime();
            playerList.push(element);
        }

    }

    //检测节目播放进度
    function check() {
        //结算已播放的时间
        var interval = (new Date().getTime()) - startTime;
        //更细播放进度
        $("#time").text(msecToTime(interval));
        //遍历轨道,判断节目是否播放
        $.each(program.params, function (index, track) {
            //遍历轨道元素
            $.each(track.elementList, function (i, element) {
                //素材开始播放时间
                var beginTime = timeToMsec(element.beginTime);
                //素材结束播放时间
                var endTime = timeToMsec(element.endTime);
                //素材在当前播放时间段内
                if (interval >= beginTime && interval < endTime) {
                    //开始播放素材
                    element.id = track.index + "_" + element.index;
                    playerElement(element);
                }
            });
        });
        //判断已播放的节目是否到结束时间   
        /* var removeList =  [];*/

        for (var i = playerList.length - 1; i >= 0; i--) {
            var element = playerList[i];
            //素材播放结束时间
            var endTime = timeToMsec(element.endTime);
            //素材时间小于已播放时间
            if (endTime < interval) {
                //节目中移除素材
                $("#" + element.id).remove();
                //播放列表中移除素材
                console.log(element);
                playerList.splice(i, 1)
                console.log(new Date() + " playerList length " + playerList.length);
                //结束本次循环
                continue;
            }
            //如果是视频,判断视频的进度与当前播放时间是否一致
            if (element.elementType == 2) {
                //当前视频计划播放时间
                var playerTime = interval - startTime;
                //获取视频实际播放时间
                var time = $("#" + element.id).attr("currentTime") * 1000;
                //实际播放时间与计划播放时间误差大于3秒，校正播放时间
                if (Math.abs(playerTime - time) > 3000) {
                    $("#" + element.id).attr("currentTime", palyTime / 1000);
                }
            }
            //如果是音频,判断音频的进度与当前播放时间是否一致
            if (element.elementType == 3) {
                //当前音频计划播放时间
                var playerTime = interval - startTime;
                //获取音频实际播放时间
                var time = $("#" + element.id).attr("currentTime") * 1000;
                //实际播放时间与计划播放时间误差大于3秒，校正播放时间
                if (Math.abs(playerTime - time) > 3000) {
                    $("#" + element.id).attr("currentTime", palyTime / 1000);
                }
            }
            //判断如果是时钟更新时钟时间
            if (element.elementType == 7) {
                $("#" + element.id).text(new Date().format(element.format));
            }
            //如果是文档类型,判断是否需要更换图片
            if (element.elementType == 10) {
                //当前文档已播放时间
                var playerTime = interval - element.startTime;
                //播放时间大于图片数量乘以每一张图片的播放时间,说明不是第一轮播放
                if (playerTime >= element.imageList.length * element.residenceTime) {
                    playerTime = playerTime % element.imageList.length;
                }
                //循环判断当前时间是否应该播放当前节目
                var inTime = null; //进入图片播放的事件
                var outTime = null; //退出图片播放的事件
                for (var i = 0; i < element.imageList.length; i++) {
                    inTime = i * element.residenceTime;
                    outTime = (i + 1) * element.residenceTime;
                    if (playerTime >= inTime && playerTime < outTime) {
                        //更新播放图片
                        if (element.playerIndex != i) {
                            $("#" + element.id).remove();
                            $("#player").append(wordHtml(element), i);
                            element.playerIndex = i; //记录播放图片的索引
                            element.playerName = element.imageList[i]; //记录播放图片的名称
                            element.playerTime = new Date().getTime(); //记录播放时间
                        }
                        break
                    }
                }
            }
        }

        // $.each(playerList, function (index, element) {    
        //});
        //删除播放时间已到的元素
        /*     for(var i=0;i< removeList.length;i++){
                 playerList.remove(removeList[i]);
                 console.log(removeList[i]);
             }*/

        //播放时间大于节目时间,停止播放
        /*    if (playerList >= timelong) {
    
            }*/

        if (started) {

        }
        //间隔100
        if (started) {
            setTimeout(check, 100);
        }
    }

    //暂停播放

    //设置播放时间播放

    //更新播放进度 


    //测试
    function test() {
        program = JSON.parse(window.sessionStorage['playParams'])
        // console.log(program)
        player()

        // $.getJSON("/pages/idm/program/makePro/json/player.json", function (data) {
        //     //设置全局界面信息
        //     program = data;
        //     //开始播放节目
        //     player();
        // });
    }

    init();
    test();

});