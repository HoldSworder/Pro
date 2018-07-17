function main() {

    class Canvas {
        constructor(canvas) {
            this.canvas = canvas
            this.width = canvas.width()
            this.height = canvas.height()
            this.imgWidth = 128
            this.typeIndex = ['图片', '视频', '音频', '文本', 'rtsp', '表格', '时钟', '天气', '网页']
        }

        init() { //入口
            $('#ruler').ruler()

            this.drag() //画布

            this.slider() //时间轴

            this.abbrTrack() //缩略时间轴

            this.repertory() //素材仓库

            this.btnBind() //按钮绑定
        }

        //画布属性
        drawImg(imgPath, x, y) { //在画布上绘制元素
            let index = $('#canvas').children().length
            let html = ''
            html += `
                <div class="canvasDiv " id="div${index}" style="top: ${y}px; left: ${x}px; position: absolute; overflow: hidden; width: auto; height: auto;">
                    <img src=${imgPath} class='canvasChild' style='width: ${this.imgWidth}px; '>
                </div>    
                `
            this.canvas.append(html)

            this.fixPosition(this, $(`#div${index}`).children()[0])

            //拖曳
            $(`#div${index}`).Tdrag({
                scope: "#canvas"
            })

            $('.ui-resizable-handle').on('mousedown', function () {
                $.disable_cloose()

                let upE = function () {
                    $.disable_open()

                    $(document).off('mouseup', upE)
                }
                $(document).on('mouseup', upE)
            })

            this.showControl()

        }

        flexImg() { //缩放一
            let checkFlag = false
            let startX
            let startY
            let that

            this.canvas.on('click', '.canvasDiv', function (e) {
                e.stopPropagation()

                if ($(this).children().length <= 2) {
                    let html = `
                        <div class='flexBtn flexBtnLeft' style="width: 5px; height: 5px; position: absolute; background: white; top: 0; left: 0; border: 1px solid black" z-index: 9999;></div>
                        <div class='flexBtn flexBtnRight' style="width: 5px; height: 5px; position: absolute; background: white; top: 0; right: 0; border: 1px solid black" z-index: 9999;></div>
                        <div class='flexBtn flexBtnRight' style="width: 5px; height: 5px; position: absolute; background: white; bottom: 0; left: 0; border: 1px solid black" z-index: 9999;></div>
                        <div class='flexBtn flexBtnLeft' style="width: 5px; height: 5px; position: absolute; background: white; bottom: 0; right: 0; border: 1px solid black" z-index: 9999;></div>
                    `
                    $(this).append(html)
                    that = $(this)
                }

                $('.flexBtn').on('mousedown', function (ev) {
                    ev.stopPropagation()

                    startX = ev.clientX
                    startY = ev.clientY

                    checkFlag = true
                })

            })

            $(document).on('mousemove', function (ev) {
                ev.stopPropagation()

                if (checkFlag) {
                    let nowX = ev.clientX
                    let nowY = ev.clientY

                    let widthN = that.find('img').width()

                    that.find('img').width(widthN + (nowX - startX) / 20)
                }
            })

            $(document).on('mouseup', function (ev) {
                ev.stopPropagation()

                if (checkFlag) {
                    checkFlag = false
                }
            })

        }

        drag() { //拖动绘制属性
            let top
            let left
            let flag = false
            let cloner
            let that
            let thats = this
            $('#itemList').on('mousedown', 'img', function (e) {
                e.preventDefault()
                let clone = $(this).clone()
                $(this).after(clone)

                clone.hide()

                cloner = clone

                top = $(this).offset().top
                left = $(this).offset().left

                $(this).css({
                    'position': 'fixed',
                    'top': `${top}px`,
                    'left': `${left}px`,
                    'z-index': '999'
                })

                that = $(this)
                flag = true

                let upE = function (e) {
                    e.preventDefault()

                    if (flag) {
                        that.remove()
                        cloner.show()

                        if (thats.checkHover(e, $('#canvas'))) { //移动到画布进行绘制

                            let nowX = e.clientX
                            let nowY = e.clientY

                            let canX = $('#canvas').offset().left
                            let canY = $('#canvas').offset().top

                            let imgX = that.width()
                            let imgY = that.height()

                            thats.drawImg(that.attr('src'), nowX - canX - imgX / 2, nowY - canY - imgY / 2)
                            thats.sliderEle(that)

                            $(document).off('mouseup', upE)
                            $(document).off('mousemove', moveE)

                        } else if (thats.checkHover(e, $('.trackBox'))) { //移动到轨道上新增元素并绘制
                            for (const item of $('.trackBox').children()) {
                                if ($(item).hasClass('track')) {
                                    if (thats.checkHover(e, $(item))) {
                                        let filename
                                        let path = that[0].src
                                        if (path.indexOf("/") > 0) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
                                        {
                                            filename = path.substring(path.lastIndexOf("/") + 1, path.length);
                                        } else {
                                            filename = path;
                                        }

                                        let trackContent = $(item).find('.trackContent')
                                        let leftAll = 0
                                        for (const i of trackContent.children()) { //有元素 获取最后一个元素的x定位
                                            let thisX = parseFloat($(i).css('left')) + $(i).width()
                                            if (thisX > leftAll) {
                                                leftAll = thisX
                                            }
                                        }

                                        let html = `
                                            <div class="silderBlock" data-l=${leftAll} style='left: ${leftAll}px'>
                                                ${filename}
                                            </div>
                                        `

                                        if (trackContent.children().length == 0) { //轨道为空 绘制图片
                                            thats.drawImg(that.attr('src'), 0, 0)
                                            $(item).find('.trackController').attr('data-t', $('#itemIndex').val())

                                        }
                                        trackContent.append(html)
                                    }
                                }
                            }
                        }

                        flag = false
                    }
                }

                let moveE = function (e) {
                    e.preventDefault()

                    if (flag) {
                        let thisW = that.width()
                        let thisH = that.height()

                        let nowX = e.clientX
                        let nowY = e.clientY

                        that.css({
                            'top': `${nowY - thisH/2}px`,
                            'left': `${nowX - thisW/2}px`
                        })
                    }
                }

                $(document).on('mouseup', upE)

                $(document).on('mousemove', moveE)

            })


        }

        resize(oparent, handle, isleft, istop, lookx, looky) { //缩放函数

            let that = this
            let disX = 0;
            let disY = 0
            let dragMinWidth = this.imgWidth
            let dragMinHeight = 'auto'
            let maxw = this.width
            let maxh = 'auto'
            // handle = handle || oDrag;

            handle.onmousedown = function (e) {
                e.stopPropagation()

                e = e || event;
                e.preventDefault();
                disX = e.clientX - this.offsetLeft;
                disY = e.clientY - this.offsetTop;
                var iparenttop = oparent.parentElement.offsetTop;
                var iparentleft = oparent.parentElement.offsetLeft;
                var iparentwidth = oparent.offsetWidth;
                // var iparentheight = oparent.offsetHeight;

                let moveE = function (e) {

                    e = e || event;
                    var iL = e.clientX - disX;
                    var iT = e.clientY - disY;
                    // var maxw = document.documentElement.clientWidth - oparent.offsetLeft - 2;
                    // var maxh = document.documentElement.clientHeight - oparent.offsetTop - 2;
                    var iw = isleft ? iparentwidth - iL : handle.offsetWidth + iL;
                    // var ih = istop ? iparentheight - iT : handle.offsetHeight + iT;
                    if (isleft) {

                        oparent.parentElement.style.left = iparentleft + iL + 'px';
                    };
                    if (istop) {

                        oparent.parentElement.style.top = iparenttop + iT + 'px';
                    };
                    if (iw < dragMinWidth) {
                        iw = dragMinWidth
                    } else if (iw > maxw) {
                        iw = maxw;
                    };
                    if (lookx) {
                        oparent.style.width = iw + 'px';
                    };
                    // if (ih < dragMinHeight) {
                    //     ih = dragMinHeight;
                    // } else if (ih > maxh) {
                    //     ih = maxh;
                    // };
                    // if (looky) {
                    //     oparent.style.height = ih + 'px';
                    // };
                    // if ((isleft && iw == dragMinWidth) || (istop && ih == dragMinHeight)) {
                    //     document.onmousemove = null;
                    // };
                    if ((isleft && iw == dragMinWidth)) {
                        document.onmousemove = null;
                    };
                    return false;
                };

                let upE = function () {
                    $(document).off('mousemove', moveE)
                    $(document).off('mouseup', upE)
                    // let left = $(oparent).offset().left
                    // let width = $(oparent).width()
                    // if ((left + width) > that.width) {
                    //     $(oparent).parent().css('left', 0)
                    // }
                    that.fixPosition(that, oparent)
                };

                $(document).on('mousemove', moveE)
                $(document).on('mouseup', upE)

            }

            $(oparent).children('img').css({
                'width': $(oparent).width(),
                'height': $(oparent).height()
            })
        }

        fixPosition(that, oparent) { //超出边界修正位置
            let left = $(oparent).offset().left
            let top = $(oparent).offset().top
            let width = $(oparent).width()
            let height = $(oparent).height()
            if ((left + width) > that.width) {
                $(oparent).parent().css('left', that.width - width)
            }
            if ((top + height) > that.height) {
                $(oparent).parent().css('top', that.height - height)
            }
            if ($(oparent).offset().top < 0) {
                $(oparent).parent().css('top', 0)
            }
            if ($(oparent).offset().left < 0) {
                $(oparent).parent().css('left', 0)
            }
        }

        showControl() { //显示缩放按钮并绑定缩放属性
            let that = this
            this.canvas.on('click', '.canvasDiv', function (e) {
                let thats = this
                let index = $('#canvas').children().length
                e.stopPropagation()

                if ($(this).children().length <= 2) {
                    let html = `
                        <div class='flexBtn flexBtnLeft' id='resizeLT${index}' style="width: 5px; height: 5px; position: absolute; background: white; top: 0; left: 0; border: 1px solid black" z-index: 9999;></div>
                        <div class='flexBtn flexBtnRight ' id='resizeRT${index}' style="width: 5px; height: 5px; position: absolute; background: white; top: 0; right: 0; border: 1px solid black" z-index: 9999;></div>
                        <div class='flexBtn flexBtnRight ' id='resizeLB${index}' style="width: 5px; height: 5px; position: absolute; background: white; bottom: 0; left: 0; border: 1px solid black" z-index: 9999;></div>
                        <div class='flexBtn flexBtnLeft ' id='resizeRB${index}' style="width: 5px; height: 5px; position: absolute; background: white; bottom: 0; right: 0; border: 1px solid black" z-index: 9999;></div>
                    `
                    $(this).append(html)
                    // that = $(this)

                    let resizeRB = document.querySelector(`#resizeRB${index}`)
                    let resizeRT = document.querySelector(`#resizeRT${index}`)
                    let resizeLT = document.querySelector(`#resizeLT${index}`)
                    let resizeLB = document.querySelector(`#resizeLB${index}`)

                    let img = $(this).children('img').get(0)

                    //四角放大
                    that.resize(img, resizeRB, false, false, true, true);
                    that.resize(img, resizeRT, false, true, true, true);
                    that.resize(img, resizeLT, true, true, true, true);
                    that.resize(img, resizeLB, true, false, true, true);
                }


            })
        }

        checkHover(e, div) { //判断是否在元素中
            // debugger
            div = div[0]

            let window = div.getBoundingClientRect()
            var x = e.clientX;
            var y = e.clientY;
            var divx1 = window.left
            var divy1 = window.top
            var divx2 = window.left + window.width
            var divy2 = window.top + window.height
            // var divx1 = div.offsetLeft;
            // var divy1 = div.offsetTop;
            // var divx2 = div.offsetLeft + div.offsetWidth;
            // var divy2 = div.offsetTop + div.offsetHeight;
            if (x < divx1 || x > divx2 || y < divy1 || y > divy2) {
                return false
            } else {
                return true
            };
        }

        checkHoverDiv(div1, div2) { //判断两个元素是否在x轴重合
            // debugger
            div1 = div1[0]
            div2 = div2[0]

            let window1 = div1.getBoundingClientRect()
            let window2 = div2.getBoundingClientRect()

            let div1L = window1.left
            let div2L = window2.left

            let div1R = window1.left + window1.width
            let div2R = window2.left + window2.width

            if ((div1L < div2L && div1R > div2L) ||
                (div2L < div1L && div2R > div1L) ||
                (div1L < div2L && div1R > div2R) ||
                (div1L > div2L && div1R < div2R)) {
                return true
            } else {
                return false
            }

        }


        //时间轴属性
        slider() { //滑块初始化
            $("#circles-slider")
                .slider({
                    min: 0,
                    max: 100,
                    range: false,
                })

                .slider("pips", {
                    first: "pip",
                    last: "pip"
                })

            let html = `
                <div class="ui-slider-range ui-corner-all ui-widget-header" style="left: 0%; width: 0%;"></div>
            `
            //添加时间线已选择时间颜色
            $('#circles-slider').append(html)

            this.alignment()
            this.moveEle()
            this.moveTrack()
            this.flexEle()
            this.trackTypeObserver()
        }

        alignment() { //滑块校准线、range、时间
            let that = this
            let html = `
                <div id="nowTimeLine" style="float:left; width: 1px; left: 0; height: 100px; background: #000; z-index: 99; top: 0; position: absolute"></div> 
            `

            $('#circles-slider').append(html)

            let boxHeight = $('.sliderContainer').height() - 16 + $('.trackBox').height()
            let boxTop = $('#circles-slider').height() + parseFloat($('#circles-slider').css('marginBottom'))

            $('#nowTimeLine').css({
                'height': boxHeight,
                'top': boxTop
            })

            let el = $('.ui-slider-handle')[0]

            function obs(mutation) {
                let change = parseFloat(mutation.target.style.left)
                $('.ui-slider-handle').mousedown()

                $('#nowTimeLine').css('left', `${change}%`) //时间线
                $('#circles-slider .ui-slider-range').width(`${change}%`) //时间条

                let totalTime = $('#nowTime').attr('data-t') * 60 //时间显示
                let nowTime = Math.floor(totalTime * (change / 100))

                let mo = String(Math.floor(nowTime / 60)).length == 1 ? `0${Math.floor(nowTime / 60)}` : Math.floor(nowTime / 60)
                let yu = String(nowTime % 60).length == 1 ? `0${nowTime % 60}` : nowTime % 60

                $('.ui-slider-handle').attr('data-t', nowTime)

                $('#nowTime').text(`${mo}:${yu}`)
            }

            that.observer(el, obs)

        }

        sliderEle(img) { //绑定元素绘制 并生成轨道
            let filename
            let that = this
            let path = img[0].src
            if (path.indexOf("/") > 0) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
            {
                filename = path.substring(path.lastIndexOf("/") + 1, path.length);
            } else {
                filename = path;
            }

            let html = `
                <div class="silderBlock" data-l='0'}>
                    ${filename}
                </div>
            `

            let lastTrack = $('.trackBox .track:last .trackContent')
            let index = lastTrack.attr('id').substr(5)

            function recursion(index) { //递归查询空轨道
                
                index = Number(index)
                if (index == 1) {
                    if ($(`#track${index}`).children().length == 0) {
                        $(`#track${index}`).append(html)
                        $(`#track${index}`).parent().find('.trackController').attr('data-t', $('#itemIndex').val())
                        return
                    } else {
                        that.newTrack()
                        $(`#track${index+1}`).append(html)
                        $(`#track${index+1}`).parent().find('.trackController').attr('data-t', $('#itemIndex').val())
                        return
                    }
                }

                if ($(`#track${index}`).children().length == 0) {
                    if ($(`#track${index-1}`).children().length == 0) {
                        recursion(index - 1)
                    } else {
                        $(`#track${index}`).append(html)
                        $(`#track${index}`).parent().find('.trackController').attr('data-t', $('#itemIndex').val())
                        return
                    }
                } else {
                    that.newTrack()
                    $(`#track${index+1}`).append(html)
                    $(`#track${index+1}`).parent().find('.trackController').attr('data-t', $('#itemIndex').val())
                    return
                }
            }

            recursion(index)


        }

        newTrack() { //新建轨道
            let indexT = ($('.track').length) + 1

            let typeIndex = $('#itemIndex').val()
            let index = 1
            for (const item of $('.track')) {   //判断重复类型轨道
                if ($(item).find('.trackController').attr('data-t') == typeIndex) {
                    index++
                }
            }

            let html = `
                <div class="track clearfix">
                    <div class="trackController col-sm-2" data-t=${typeIndex}>
                        <span>${this.typeIndex[typeIndex - 1]}${index}</span>
                        <span class="glyphicon glyphicon glyphicon-align-justify" aria-hidden="true"></span>
                    </div>
                    <div id="track${indexT}" class="trackContent col-sm-10"></div>
                </div>
            `
            if ($('.trackSeize').length != 0) {
                $('.trackSeize').eq(0).remove()
            }

            $('.track:last').after(html)

            
        }

        moveEle() { //在轨道上移动元素
            let that = this
            $('.trackBox').on('mousedown', '.silderBlock', function (e) {
                e.preventDefault()
                e.stopPropagation()
                let thats = this

                let top = $(this).offset().top
                let left = $(this).offset().left
                let divW = $(this).width()
                let divH = $(this).height()

                let downX = e.clientX //鼠标落下X
                let eItemX = downX - left //鼠标距离元素左边界距离

                $(this).css({
                    'position': 'fixed',
                    'top': `${top}px`,
                    'left': `${left}px`,
                    'width': `${divW}px`,
                    'z-index': 9999
                })

                let moveE = function (e) {

                    let nowX = e.clientX
                    let nowY = e.clientY

                    $(thats).css({
                        'top': `${nowY - divH/2}px`,
                        'left': `${nowX - eItemX}px`
                    })
                }



                let upE = function (e) {
                    e.stopPropagation()
                    e.preventDefault()
                    // debugger
                    for (const item of $('.track')) { //循环所有轨道 找到元素将移动的轨道
                        let copyId = $(thats).parent().attr('id')
                        let itemId = $(item).children().eq(1).attr('id')
                        let itemChildren = $(item).children().eq(1).children()
                        let trackW = $(item).find('.trackContent').width() //轨道长度

                        let eX = e.clientX //鼠标点击距离左边界距离
                        let thisX = parseFloat($(thats).offset().left) //元素距离左边界距离
                        let trackX = $(thats).parent().offset().left //轨道距离左边界距离

                        if (that.checkHover(e, $(item).find('.trackContent')) && (copyId != itemId)) {

                            if (itemChildren.length != 0) { //判断轨道内是否有元素
                                let leftAll = 0
                                for (const i of itemChildren) { //有元素 获取最后一个元素的x定位
                                    let thisX = parseFloat($(i).css('left')) + $(i).width()
                                    if (thisX > leftAll) {
                                        leftAll = thisX
                                    }
                                }

                                $(thats).attr('data-l', leftAll)

                                $(item).children().eq(1).append($(thats))

                                $(thats).css({
                                    'position': 'absolute',
                                    'top': '0px',
                                    'left': `${leftAll}px`,
                                    'width': '5%',
                                    'z-index': '0'
                                })

                            } else { //没元素 成为第一个元素


                                $(item).children().eq(1).append($(thats))

                                $(thats).attr('data-l', '0')
                                $(thats).css({
                                    'position': 'absolute',
                                    'top': '0px',
                                    'left': `0px`,
                                    'z-index': '0'
                                })

                            }
                            break
                        } else if (that.checkHover(e, $(item).find('.trackContent')) &&
                            (copyId == itemId) &&
                            eX - trackX > eItemX &&
                            trackW - (eX - trackX) > $(thats).width() - eItemX) { //轨道内移动

                            let flag = false

                            let trackEle = $(thats).parent().children()

                            for (const it of trackEle) {
                                // debugger
                                if (that.checkHoverDiv($(thats), $(it))) {
                                    $(thats).css({
                                        'position': 'absolute',
                                        'top': `0px`,
                                        'left': `${$(thats).attr('data-l')}px`,
                                        'width': `${divW}px`,
                                        'z-index': 0
                                    })

                                    flag = true
                                }
                            }

                            if (!flag) {

                                $(thats).attr('data-l', eX - trackX - eItemX)
                                $(thats).css({
                                    'position': 'absolute',
                                    'top': `0px`,
                                    'left': `${$(thats).attr('data-l')}px`,
                                    'width': `${divW}px`,
                                    'z-index': 0
                                })
                            }

                            break
                        } else { //移出轨道还原位置
                            $(thats).css({
                                'position': 'absolute',
                                'top': `0px`,
                                'left': `${$(thats).attr('data-l')}px`,
                                'width': `${divW}px`,
                                'z-index': 0
                            })


                        }
                    }

                    $(document).off('mousemove', moveE)
                    $(document).off('mouseup', upE)
                }

                $(document).on('mouseup', upE)
                $(document).on('mousemove', moveE)


            })
        }

        moveTrack() { //移动轨道
            let that = this
            $('.trackBox').on('mousedown', '.glyphicon', function (e) {
                e.preventDefault()
                e.stopPropagation()
                let thats = $(this).parent().parent()
                let copy = $(this).parent().parent().clone()
                thats.after(copy)

                let top = $(copy).offset().top
                let left = $(copy).offset().left
                let divW = $(copy).width()
                let divH = $(copy).height()

                $(copy).css({
                    'position': 'fixed',
                    'top': `${top}px`,
                    'left': `${left}px`,
                    'width': `${divW}px`,
                    'z-index': 9999,
                    'box-shadow': '5px 5px 5px #888888'
                })

                let moveE = function (e) {

                    let nowX = e.clientX
                    let nowY = e.clientY

                    $(copy).css({
                        'top': `${nowY - divH/2}px`,
                        'left': `${nowX - divW/6}px`
                    })
                }



                let upE = function (e) {
                    e.stopPropagation()
                    e.preventDefault()
                    for (const item of $('.track')) {
                        // debugger
                        let copyId = thats.children().eq(1).attr('id')
                        let itemId = $(item).children().eq(1).attr('id')

                        if (that.checkHover(e, $(item)) && (copyId != itemId)) { //轨道拉到其他轨道上释放 将插入其下方

                            $(item).after($(thats))
                            $(thats).css({
                                'position': 'initial',
                            })
                            $(copy).remove()
                        } else if (that.checkHover(e, $('.sliderContainer'))) { //将轨道拉到时间线置顶
                            $('.trackBox').children().eq(0).before($(thats))
                            $(thats).css({
                                'position': 'initial',
                            })
                            $(copy).remove()
                        } else {
                            $(copy).remove()
                        }

                    }

                    $(document).off('mousemove', moveE)
                    $(document).off('mouseup', upE)
                }

                $(document).on('mouseup', upE)
                $(document).on('mousemove', moveE)


            })
        }

        flexEle() { //元素伸缩属性
            let that = this
            $('.trackBox').on('click', '.silderBlock', function () {
                let parent = this
                let trackL = $(this).parent().offset().left
                let trackW = $(this).parent().width()
                let divW = $(this).width()
                let divH = $(this).height()

                $('.checkEle').removeClass('checkEle')
                $(this).addClass('checkEle')

                $('.eleWidth').remove()

                if ($(this).children().length == 0) {
                    let html = `
                        <div class='eleWidthR eleWidth'></div>
                        <div class='eleWidthL eleWidth'></div>
                    `
                    $(this).append(html)
                }


                $(this).on('mousedown', '.eleWidth', function (e) {
                    e.preventDefault()
                    e.stopPropagation()

                    let startX = e.clientX
                    let eleW = this

                    let width = $(parent).width()
                    let left = $(eleW).offset().left

                    let moveE = function (e) {

                        e.preventDefault()
                        e.stopPropagation()

                        let nowX = e.clientX
                        let flag = true

                        let trackE = $(parent).parent().find('.silderBlock')


                        for (const item of trackE) {
                            if (that.checkHover(e, $(item)) && item != parent) {
                                $(document).off('mousemove', moveE)
                                return
                            }
                        }

                        if ($(eleW).hasClass('eleWidthR')) {
                            if (nowX > trackL && nowX < trackL + trackW) {
                                $(parent).css({
                                    'width': `${width + (nowX - left)}`
                                })
                            }
                        } else {
                            if (nowX > trackL && nowX < trackL + trackW) {
                                let followX = parseFloat($(parent).attr('data-l')) - parseFloat(left - nowX)
                                $(parent).css({
                                    'width': `${width + (left - nowX)}`,
                                    'left': `${followX}px`
                                })
                            }
                        }


                    }

                    let upE = function (e) {
                        e.preventDefault()
                        e.stopPropagation()

                        let nowX = e.clientX

                        $(parent).css({
                            'width': `${$(parent).width()}`
                        })

                        $(document).off('mousemove', moveE)
                        $(document).off('mouseup', upE)
                    }


                    $(document).on('mouseup', upE)
                    $(document).on('mousemove', moveE)

                })
            })
        }

        trackTypeObserver() { //监听轨道类型变化
            let that = this
            var observer = new MutationObserver(function (mutations, observer) {
                mutations.forEach(function (mutation) {
                    let target = $(mutation.target)
                    let change = target.attr('data-t')
                    let index = 0
                    for (const item of $('.track')) {
                        if ($(item).find('.trackController').attr('data-t') == change) {
                            index++
                        }
                    }

                    target.children().eq(0).text(`${that.typeIndex[change - 1]}${index}`)
                })
            })
            var config = {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: [
                    'data-t'
                ]
            }

            let el = $('.trackController')[0]
            observer.observe(el, config)
        }



        //缩略时间轴
        abbrTrack() { //初始化滑块
            $("#abbr-slider")
                .slider({
                    min: 0,
                    max: 100,
                    range: false,
                })

                .slider("pips", {
                    first: "pip",
                    last: "pip",
                    rest: false
                })

            this.abbrBind()
            this.abbrCss()
        }

        abbrBind() { //绑定时间轴

            $('#abbr-slider').find('.ui-slider-handle').css('left', '10%')

            var el = $('#abbr-slider').find('.ui-slider-handle')[0]

            function obs(mutation) { //监听缩略时间轴变化

                let change = parseFloat(mutation.target.style.left) / (100 / 24)

                $('#nowTime').attr('data-t', 60 * change)

                $('.ui-slider-handle').mousedown()

                let times = $('#nowTime').attr('data-t')
                let timeNow = $('#nowTime').text()
                let timeArr = $('#nowTime').text().split(':')
                let timeS = timeArr[0] * 60 + timeArr[1]
                let timePer = timeS / (times * 60)

                $('#circles-slider .ui-slider-handle').css('left', `${timePer <= 100 ? timePer : 100}%`)

            }

            this.observer(el, obs)

        }

        abbrCss() { //时间轴样式
            $('.timeLineBox').css('height', $('.timeLine').height() + 14)
        }


        //素材仓库
        repertory() { //素材仓库初始化
            let bodyH = document.body.clientHeight
            // let height = bodyH - $('#myTab').height()
            let top = $('#myTab').height() + $('.breadcrumb').height() + parseFloat($('.breadcrumb').css('padding-top')) + parseFloat($('.breadcrumb').css('padding-bottom'))
            let height = bodyH - top

            $('#myTabContent').css('height', height)
            $('#ediBox').css({'height': height, 'top': top})

            $('.checkInit').bootstrapSwitch()

            this.videoEdiInit()
            this.audioEdiInit()
        }

        videoEdiInit() {
            $('#video-slider').slider({
                min: 0,
                max: 100,
                range: true,
            }).slider("pips", {
                rest: false
            })

            $('#video-vol-slider').slider({
                min: 0,
                max: 100,
                range: false,
            }).slider("pips", {
                rest: false
            }).slider("float")


            $('#video-video-check').bootstrapSwitch()
            $('#video-audio-check').bootstrapSwitch()
        }

        audioEdiInit() {
            $('#audio-slider').slider({
                min: 0,
                max: 100,
                range: true,
            }).slider("pips", {
                rest: false
            })

            $('#audio-vol-slider').slider({
                min: 0,
                max: 100,
                range: false,
            }).slider("pips", {
                rest: false
            }).slider("float")
        }



        btnBind() { //按钮绑定事件
            let that = this
            $('#addTrack').on('click', function () {
                that.newTrack()
            })
        }

        observer(el, func) { //监听属性变化观察者
            var observer = new MutationObserver(function (mutations, observer) {
                mutations.forEach(function (mutation) {
                    func(mutation)
                })
            })
            var config = {
                attributes: true,
                attributeOldValue: true,
                attributeFilter: [
                    'style'
                ]
            }

            observer.observe(el, config)
        }
    }


    function initCanvas() {
        let canvas_node = $('#canvas')
        let canvas = new Canvas(canvas_node)


        canvas.init()

    }


    initCanvas()

}

main()