function main() {

    class Canvas {
        constructor(canvas) {
            this.canvas = canvas
            this.width = canvas.width()
            this.height = canvas.height()
            this.imgWidth = 128
        }

        init() { //入口
            this.drag()
            this.showControl()

            this.slider()
        }

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
            // <img src=${imgPath} class='canvasChild ui-widget-content' style='position: absolute; top: ${y}px; left: ${x}px'>

            // 拖拽图片
            // $('.canvasDiv').draggable({
            //     containment: "#canvas",
            //     snap: true
            // })

            //伸缩图片
            // $(".canvasChild").resizable({
            //     // ghost: true,
            //     aspectRatio: true,
            //     // maxWidth: this.width,
            //     containment: "#canvas"
            // })

            //拖曳
            $(`#div${index}`).Tdrag({
                scope: "#canvas"
            })

            $('.ui-resizable-handle').on('mousedown', function () {
                $.disable_cloose()
            })

            $(document).on('mouseup', function () {
                $.disable_open()
            })


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
                    console.log((nowX - startX) / 20)
                    that.find('img').width(widthN + (nowX - startX) / 20)
                }
            })

            $(document).on('mouseup', function (ev) {
                ev.stopPropagation()

                if (checkFlag) {
                    checkFlag = false
                }
            })
            // this.canvas.on('mousedown', '.flexBtn', function(ev) {
            //     ev.stopPropagation()

            //     console.log('adf')
            // })

        }

        drag() { //拖动属性
            let top
            let left
            let flag = false
            let cloner
            let that
            let hover = false
            let thats = this
            $('#scene').on('mousedown', 'img', function (e) {
                e.preventDefault()
                let clone = $(this).clone()
                $(this).after(clone)
                // $('#scene').append(clone)
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

            })

            $(document).on('mouseup', function (e) {
                e.preventDefault()

                if (flag) {
                    that.remove()
                    cloner.show()

                    if (hover) {
                        let nowX = e.clientX
                        let nowY = e.clientY

                        let canX = $('#canvas').offset().left
                        let canY = $('#canvas').offset().top

                        let imgX = that.width()
                        let imgY = that.height()

                        thats.drawImg(that.attr('src'), nowX - canX - imgX / 2, nowY - canY - imgY / 2)
                        thats.sliderBlock(that)
                    }

                    flag = false
                }
            })

            $(document).on('mousemove', function (e) {
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
            })

            $('#canvas').on('mouseover', function () {
                hover = true
            })

            $('#canvas').on('mouseout', function () {
                hover = true
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

                document.onmousemove = function (e) {

                    e = e || event;
                    var iL = e.clientX - disX;
                    var iT = e.clientY - disY;
                    // var maxw = document.documentElement.clientWidth - oparent.offsetLeft - 2;
                    // var maxh = document.documentElement.clientHeight - oparent.offsetTop - 2;
                    var iw = isleft ? iparentwidth - iL : handle.offsetWidth + iL;
                    // var ih = istop ? iparentheight - iT : handle.offsetHeight + iT;
                    if (isleft) {
                        // console.log(oparent.parentElement)
                        // console.log(iL)
                        oparent.parentElement.style.left = iparentleft + iL + 'px';
                    };
                    if (istop) {
                        // console.log(iparenttop + iT)
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
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    // let left = $(oparent).offset().left
                    // let width = $(oparent).width()
                    // if ((left + width) > that.width) {
                    //     $(oparent).parent().css('left', 0)
                    // }
                    that.fixPosition(that, oparent)
                };
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
                }

                let resizeRB = document.querySelector(`#resizeRB${index}`)
                let resizeRT = document.querySelector(`#resizeRT${index}`)
                let resizeLT = document.querySelector(`#resizeLT${index}`)
                let resizeLB = document.querySelector(`#resizeLB${index}`)

                let img = $(this).children('img').get(0)

                //四角变大
                that.resize(img, resizeRB, false, false, true, true);
                that.resize(img, resizeRT, false, true, true, true);
                that.resize(img, resizeLT, true, true, true, true);
                that.resize(img, resizeLB, true, false, true, true);

            })
        }


        //时间线功能
        slider() { //滑块初始化
            $("#circles-slider")
                .slider({
                    min: 0,
                    max: 100,
                    range: true,
                })

                .slider("pips", {
                    first: "pip",
                    last: "pip",
                    // rest: "label"
                })

            $('.ui-slider-handle').eq(0).hide()

            this.alignment()
        }

        alignment() { //滑块校准线
            let html = `
                <div id="nowTimeLine" style="float:left; width: 1px; left: 0; height: 100px; background: #000; z-index: 99; top: 0; position: absolute"></div> 
            `

            $('#circles-slider').append(html)

            let boxHeight = $('.trackBox').height()
            let boxTop = $('#circles-slider').height() + parseFloat($('#circles-slider').css('marginBottom'))

            $('#nowTimeLine').css({
                'height': boxHeight,
                'top': boxTop
            })

            $('#circles-slider').on('mousedown', '.ui-slider-handle', function () {
                $(document).on('mousemove', function () {
                    let width = $('.ui-slider-range').width()
                    $('#nowTimeLine').css('left', width)

                })
            })


        }

        sliderBlock(img) { //绑定元素绘制 并生成时间轴滑块
            let filename
            let path = img[0].src
            if (path.indexOf("/") > 0) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
            {
                filename = path.substring(path.lastIndexOf("/") + 1, path.length);
            } else {
                filename = path;
            }

            this.newTrack()


            let html = `
                <div class="silderBlock">
                    ${filename}
                </div>
            `

            $('.track .trackContent').append(html)
        }

        newTrack() { //新建轨道
            let index = $('.trackBox').children().length
            let html = `
                <div class="track clearfix">
                    <div class="trackController col-sm-2">
                        <span>轨道${index}</span>
                        <span id="track${index}" class="glyphicon glyphicon glyphicon-align-justify" aria-hidden="true"></span>
                    </div>
                    <div class="trackContent col-sm-10"></div>
                </div>
            `

            $('.trackBox').append(html)
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