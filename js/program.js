const $option = JSON.parse(window.localStorage.getProgram)
var canvas

$.extend({
    ajaxJson: function (opt) {
        opt.dataType = "json";
        opt.type = "post";
        opt.contentType = "application/json;charset=utf-8";
        opt.data = JSON.stringify(opt.data);
        $.ajax(opt);
    }
});

/**
 * @class 画布类
 * @param {string} NODE_ENV - ('development', 'production') 配置环境参数
 */
class Canvas {
    constructor(canvas, proObj) {
        this.canvas = canvas
        this.width = canvas.width()
        this.height = canvas.height()
        this.imgWidth = 128
        this.imgHeight = 80
        this.typeIndex = [
            '图片',
            '视频',
            '音频',
            '文本',
            'rtsp',
            '表格',
            '时钟',
            '天气',
            '网页',
            '文档',
            '图片盒子'
        ]
        this.SceneDto = []
        this.addImgPath = 'img/add/add.png'
        this.seize = 'size=256x128&text='
        this.ImgPath = './img/'
        this.areaId = proObj.areaId
        this.proObj = proObj
        this.constrain = [] //等比例缩放
        this.baseUrl = 'https://www.easy-mock.com/mock/5cdb7945f2f8913ca63714d2/test'
        this.NODE_ENV = 'development'
        this.api = {
            //素材
            material: '../Pro/json/material.json',
            // material: this.NODE_ENV == 'development' ? this.baseUrl + '/idm/template/getmaterial.do' : '/idm/template/getmaterial.do',
            //模版
            template: this.NODE_ENV == 'development' ? this.baseUrl + '/idm/template/gettemplates.do' : '/idm/template/gettemplates.do',
            //保存
            save: '/idm/program/saveprogram.do',
            saveEdi: '/idm/program/updateprogram.do',
            //保存为模版
            savetemplate: '/idm/template/savetemplate.do',
            //获取素材组
            // getGroup: '/idm/material/groupname'
            // getGroup: './json/group.json'
            getGroup: '../Pro/json/group.json'
            // getGroup: this.NODE_ENV == 'development' ? this.baseUrl + '/idm/material/groupname' : '/idm/material/groupname'
        }
        this.mapElement = new Map()
    }

    init() {
        //入口
        // $('#ruler').ruler()

        this.drag() //画布

        this.slider() //时间轴

        this.abbrTrack() //缩略时间轴

        this.repertory() //素材仓库

        this.btnBind() //按钮绑定

        this.templateInit() //模版初始化

        this.save() //保存

        this.styleInit() //初始化样式

        this.setTransform() //初始化百分比缩放

        this.setPlayLength() //回车设置播放时长

        this.play() //播放预览

        this.getGroup() //获取素材组

        this.pluginsInit() //插件初始化

        this.setTrackName() //修改轨道名称
    }

    //初始化插件
    pluginsInit() {
        // this.absorb = new Adsorb({
        //     container: $('#canvas')[0],
        //     attr: '.canvasDiv',
        //     canvas: {
        //         container: $('#hiddenBox')[0]
        //     }
        // })

        $('.text-color').colorpicker({
            fillcolor: true,
            success: function (o, color) {
                $('.checkCanvas .canvasChild').css("color", color);
            }
        })

        $('.back-color').colorpicker({
            fillcolor: true,
            success: function (o, color) {
                $('.checkCanvas .canvasChild').css("background", color);
            }
        })
    }

    //在画布上绘制元素
    //绑定拖曳属性
    //绑定x、y轴
    async drawImg(imgPath, id, x, y, img, wid, hei) {
        let that = this
        // let width = this.imgWidth
        // let height = this.imgHeight
        let width = wid || this.imgWidth
        let height = hei || this.imgHeight
        let index = $('#canvas').children().length
        let eleType = img instanceof jQuery ? $('#itemIndex').val() : img.elementType

        if (eleType == 3) {
            return
        }

        let html = ''
        // let cssText = ``
        let cssText = `width: ${width}px; height: ${height}px`

        let dataJ = img instanceof jQuery ? img.attr('data-J') : JSON.stringify(img)
        if (imgPath == this.addImgPath) {
            dataJ = JSON.stringify({})
        }

        if (eleType == 4) { //文字素材处理

            html = `
                    <div class="canvasDiv" data-J='${dataJ}' data-i="${id}" id="div${index}" style="top: ${y}px; left: ${x}px; position: absolute; overflow: hidden; width: auto; height: auto;">
                        <div class='canvasChild placeholder' style='width: ${width}px; height: ${height}px; background: white; word-wrap: break-word; display: flex; align-items: center'>
                            
                        </div>
                    </div>
                `
        } else if (eleType == 7) { //时钟素材处理
            html = `
                <div class="canvasDiv" data-J='${dataJ}' data-i="${id}" id="div${index}" style="top: ${y}px; left: ${x}px; position: absolute; overflow: hidden; width: auto; height: auto;">
                    <div class='canvasChild placeholder' style='width: ${width}px; height: ${height}px; background: white; word-wrap: break-word;'>
                        
                    </div>
                </div>
            `
        } else {
            //其他素材
            if (imgPath == this.addImgPath) {
                // debugger
                imgPath =
                    this.seize +
                    $('#itemIndex')
                    .find('option:selected')
                    .text()
                html = `
                        <div class="canvasDiv" data-J='${dataJ}' data-i="${id}" id="div${index}" style="top: ${y}px; left: ${x}px; position: absolute; overflow: hidden; width: auto; height: auto;">
                            <img options=${imgPath} class='canvasChild placeholder' style='${cssText} '>
                        </div>
                    `
            } else {
                // 缩略图路径处理
                let url
                let thumbnail = JSON.parse(dataJ).thumbnail
                let fileName = JSON.parse(dataJ).fileName
                if (that.NODE_ENV == 'development') {
                    url = `img/${fileName}`
                } else {
                    let areaId = JSON.parse(dataJ).areaId
                    if (eleType == 1) {
                        url = `/files/idm/${areaId}/${fileName}`
                    } else {
                        url = `/images/thumbnail/material/${thumbnail}`
                    }
                }


                html = `
                        <div class="canvasDiv" data-J='${dataJ}' data-i="${id}" id="div${index}" style="top: ${y}px; left: ${x}px; position: absolute; overflow: hidden; width: auto; height: auto;">
                            <img src="${url}" class='canvasChild' style='${cssText} '>
                        </div>
                    `
            }
        }

        await Tool.appendAsync(() => {
            that.canvas.append(html)
            $(`#div${index}`).click()
            // that.focusEle($(`#div${index}`)[0])
        }, id)


        if (eleType == 7) { //时钟计时处理
            setClock()
        }

        function setClock() {
            const n = Tool.getTime(new Date())
            document.querySelector(`#div${index} div`).innerHTML = `${n.year}-${n.month}-${n.day} ${n.hours}:${n.min}:${n.sec}`
        }


        this.fixPosition(this, $(`#div${index}`).children()[0])

        //拖曳
        let divE = $(`#div${index}`)
        divE.Tdrag({
            scope: '#canvas',
            // grid: [5, 5],
            cbMove(ele) {
                let form = $('.activeEdi')
                // let form = $('#ediBox')
                //     .eq($('.checkEle').attr('data-l') - 1)
                //     .find('form')

                // let inputX = form.find('input[name="location_x"]')
                // let inputY = form.find('input[name="location_y"]')

                // inputX.val(parseInt(divE.css('left')))
                // inputY.val(parseInt(divE.css('top')))

                //同步轨道数据
                // that.setDataJ(
                //     ['location_x', 'location_y'],
                //     [parseInt(divE.css('left')), parseInt(divE.css('top'))],
                //     $(ele).attr('data-i')
                // )

            }
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

        placeholder.render()

        ;
        (function (dom, THAT) { //绘制大图片处理
            const img = dom.find('img, div')
            const w = img[0].naturalWidth
            const h = img[0].naturalHeight
            const cW = THAT.proObj.width
            const cH = THAT.proObj.height

            if (w > cW || h > cH) {
                console.log('out')
            }
        }($(`#div${index}`), this))
    }

    //拖动绘制属性
    drag() {
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

            cloner = clone

            top = $(this).offset().top
            left = $(this).offset().left

            $(this).css({
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                'z-index': '999'
            })

            that = $(this)
            flag = true

            let upE = async function (e) {
                e.preventDefault()
                const nameId = new Date().getTime().toString()
                // const nameId = Symbol()

                if (flag) {
                    that.remove()
                    cloner.show()

                    if (thats.checkHover(e, $('#hiddenBox'))) {
                        //11.12修改绘制范围为hiddenBox
                        //移动到画布进行绘制

                        let nowX = e.clientX
                        let nowY = e.clientY

                        let canX = $('#hiddenBox').offset().left
                        let canY = $('#hiddenBox').offset().top

                        let imgX = that.width()
                        let imgY = that.height()

                        //生成轨道元素
                        //绘制画布元素
                        await thats.drawImg(
                            that.attr('src'),
                            nameId,
                            nowX - canX - imgX / 2,
                            nowY - canY - imgY / 2,
                            that
                        )

                        thats.sliderEle(that, nameId)

                        const elementObj = new Element(that.attr('data-J'), nameId)
                        thats.mapElement.set(nameId, elementObj)

                        $(document).off('mouseup', upE)
                        $(document).off('mousemove', moveE)
                    } else if (thats.checkHover(e, $('.trackBox'))) {

                        //移动到轨道上新增元素并绘制
                        for (const item of $('.trackBox').children()) {
                            if ($(item).hasClass('track')) {
                                if (thats.checkHover(e, $(item))) {
                                    let filename
                                    let trName //轨道名称
                                    let path = that[0].src
                                    if (path.indexOf('/') > 0) {
                                        //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
                                        filename = path.substring(
                                            path.lastIndexOf('/') + 1,
                                            path.length
                                        )
                                        trName = filename
                                    } else {
                                        filename = path
                                        trName = JSON.parse(
                                            img.attr('data-j')
                                        ).materialName
                                    }

                                    let trackContent = $(item).find(
                                        '.trackContent'
                                    )
                                    let leftAll = 0
                                    for (const i of trackContent.children()) {
                                        //有元素 获取最后一个元素的x定位
                                        let thisX =
                                            parseFloat($(i).css('left')) +
                                            $(i).width()
                                        if (thisX > leftAll) {
                                            leftAll = thisX
                                        }
                                    }

                                    let html = `
                                            <div class="silderBlock" data-s=${path} data-i=${nameId} data-J='${that.attr(
                                            'data-J'
                                        )}' data-l=${leftAll} data-t=${$(
                                            '#itemIndex'
                                        ).val()} style='left: ${leftAll}px'>
                                                ${trName}
                                            </div>
                                        `

                                    trackContent.append(html)

                                    //绘制图片
                                    await thats.drawImg(
                                        that.attr('src'),
                                        nameId,
                                        0,
                                        0,
                                        that
                                    )

                                    $(item)
                                        .find('.trackController')
                                        .attr(
                                            'data-t',
                                            $('#itemIndex').val()
                                        )


                                    const elementObj = new Element(that.attr('data-J'), nameId)
                                    thats.mapElement.set(nameId, elementObj)
                                    elementObj.dDiv.addClass('hidden')

                                    if (trackContent.children().length == 1) {
                                        //轨道为空 绘制图片
                                        elementObj.dDiv.removeClass('hidden')
                                    }
                                }
                            }
                        }
                        $(document).off('mouseup', upE)
                        $(document).off('mousemove', moveE)
                    }

                    $(document).off('mouseup', upE)
                    $(document).off('mousemove', moveE)
                    flag = false
                }
                $(document).off('mouseup', upE)
                $(document).off('mousemove', moveE)
            }

            let moveE = function (e) {
                e.preventDefault()

                if (flag) {
                    let thisW = that.width()
                    let thisH = that.height()

                    let nowX = e.clientX
                    let nowY = e.clientY

                    that.css({
                        top: `${nowY - thisH / 2}px`,
                        left: `${nowX - thisW / 2}px`
                    })
                }
            }

            $(document).on('mouseup', upE)

            $(document).on('mousemove', moveE)
        })
    }

    //缩放属性
    resize(oparent, handle, isleft, istop, lookx, looky) {
        let that = this
        let disX = 0
        let disY = 0
        var nWidth = oparent.naturalWidth
        var nHeight = oparent.naturalHeight
        let dragMinWidth = this.imgWidth
        let dragMinHeight = 'auto'
        let maxw = this.width
        let maxh = this.height
        handle = handle || oDrag

        handle.onmousedown = function (e) {
            e.stopPropagation()

            e = e || event
            e.preventDefault()
            disX = e.clientX - this.offsetLeft
            disY = e.clientY - this.offsetTop
            var iparenttop = oparent.parentElement.offsetTop
            var iparentleft = oparent.parentElement.offsetLeft
            var iparentwidth = oparent.offsetWidth
            var iparentheight = oparent.offsetHeight


            let moveE = function (e) {
                e = e || event
                var iL = e.clientX - disX
                var iT = e.clientY - disY
                // maxw = document.documentElement.clientWidth - oparent.offsetLeft - 2;
                // maxh = document.documentElement.clientHeight - oparent.offsetTop - 2;
                var iw = isleft ?
                    iparentwidth - iL :
                    handle.offsetWidth + iL
                var ih = istop ?
                    iparentheight - iT :
                    handle.offsetHeight + iT
                if (isleft) {
                    oparent.parentElement.style.left =
                        iparentleft + iL + 'px'
                }
                if (istop) {
                    oparent.parentElement.style.top = iparenttop + iT + 'px'
                }

                // 锁定最大缩放
                if (iw < dragMinWidth) {
                    iw = dragMinWidth
                } else if (iw > maxw) {
                    iw = maxw
                }

                if (ih < dragMinHeight) {
                    ih = dragMinHeight
                } else if (ih > maxh) {
                    ih = maxh
                    return
                }

                //缩放关联缩放条
                if (lookx) {
                    //等比缩放
                    oparent.style.width = iw + 'px'
                    oparent.style.height = nHeight * (iw / nWidth)

                    // let form = $('#ediBox')
                    //     .eq($('.checkEle').attr('data-t') - 1)
                    //     .find('form')

                    let form = $('.activeEdi form')

                    // 8-27解除缩放绑定缩放条

                    // let transN = Math.floor((iw / nWidth).toFixed(2) * 100)

                    // form.find('input[name="zoomInput"]').val(
                    //     transN > 500 ? 500 : transN
                    // )

                    // $('.activeEdi .zoom .ui-slider-tip').text(transN)
                    // $('.activeEdi .zoom .ui-slider-handle').css(
                    //     'left',
                    //     `${(100 / 500) * transN}%`
                    // )
                }


                if (looky) {
                    //非等比缩放
                    oparent.style.height = ih + 'px'

                    $('.activeEdi')
                        .find('input[name="width"]')
                        .val($('.checkCanvas .canvasChild').width())
                    $('.activeEdi')
                        .find('input[name="height"]')
                        .val($('.checkCanvas .canvasChild').height())
                }

                if (
                    (isleft && iw == dragMinWidth) ||
                    (istop && ih == dragMinHeight)
                ) {
                    document.onmousemove = null
                }

                if (isleft && iw == dragMinWidth) {
                    document.onmousemove = null
                }
                return false
            }

            let upE = function () {
                $(document).off('mousemove', moveE)
                $(document).off('mouseup', upE)
                let left = $(oparent).offset().left
                let width = $(oparent).width()
                if (left + width > that.width) {
                    $(oparent)
                        .parent()
                        .css('left', 0)
                }
                that.fixPosition(that, oparent)
            }

            $(document).on('mousemove', moveE)
            $(document).on('mouseup', upE)
        }

        $(oparent)
            .children('img')
            .css({
                width: $(oparent).width(),
                height: $(oparent).height()
            })
    }

    //点击图片 显示缩放按钮并绑定缩放属性
    showControl() {
        let that = this
        this.canvas.on('click', '.canvasDiv', function (e) {
            // debugger
            that.focusEle(this)
        })
    }

    focusEle(dom) {
        const THAT = this
        let index = $('#canvas').children().length

        let dataId = $(dom).attr('data-i')
        let trackEle = $('.trackBox').find(`div[data-i=${dataId}]`)
        if (!trackEle.hasClass('checkEle')) {
            // debugger
            trackEle.click()
        }

        // // 设置z-index
        // $('#canvas')
        //     .children()
        //     .css('zIndex', 1000)
        // $(dom).css('zIndex', 1040)

        $('.flexBtn').remove()
        if ($(dom).children().length <= 2) {
            let html = `
                    <div class='flexBtn flexBtnLeft' id='resizeLT${index}' style=" top: 0; left: 0; "></div>
                    <div class='flexBtn flexBtnRight' id='resizeRT${index}' style=" top: 0; right: 0; "></div>
                    <div class='flexBtn flexBtnRight' id='resizeLB${index}' style=" bottom: 0; left: 0; "></div>
                    <div class='flexBtn flexBtnLeft ' id='resizeRB${index}' style=" bottom: 0; right: 0; "></div>
                `
            $(dom).append(html)
            // that = $(dom)
            $('.checkCanvas').removeClass('checkCanvas')
            $(dom).addClass('checkCanvas')

            let resizeRB = document.querySelector(`#resizeRB${index}`)
            let resizeRT = document.querySelector(`#resizeRT${index}`)
            let resizeLT = document.querySelector(`#resizeLT${index}`)
            let resizeLB = document.querySelector(`#resizeLB${index}`)

            let img = $(dom)
                .children('.canvasChild')
                .get(0)

            //四角放大
            if (
                THAT.constrain.indexOf(
                    Number($('.checkEle').attr('data-t'))
                ) == -1
            ) {
                THAT.resize(img, resizeRB, false, false, true, true)
                THAT.resize(img, resizeRT, false, true, true, true)
                THAT.resize(img, resizeLT, true, true, true, true)
                THAT.resize(img, resizeLB, true, false, true, true)
            } else {
                THAT.resize(img, resizeRB, false, false, true, false)
                THAT.resize(img, resizeRT, false, true, true, false)
                THAT.resize(img, resizeLT, true, true, true, false)
                THAT.resize(img, resizeLB, true, false, true, false)
            }
        }
    }

    //时间轴属性
    //滑块初始化
    slider() {
        $('#circles-slider')
            .slider({
                min: 0,
                max: 100,
                range: false
            })

            .slider('pips', {
                first: 'pip',
                last: 'pip'
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
        // this.trackTypeObserver($('.trackController')[0])
    }

    //滑块校准线、range、时间
    alignment() {
        let that = this
        let html = `
                <div id="nowTimeLine" style="float:left; width: 1px; left: 0; height: 100px; background: #000; z-index: 99; top: 0; position: absolute"></div>
            `

        $('#circles-slider').append(html)

        let boxHeight =
            $('.sliderContainer').height() - 16 + $('.trackBox').height()
        let boxTop =
            $('#circles-slider').height() +
            parseFloat($('#circles-slider').css('marginBottom'))

        $('#nowTimeLine').css({
            height: boxHeight,
            top: boxTop
        })

        let el = $('.ui-slider-handle')[0]

        function obs(mutation) {
            let change = parseFloat(mutation.target.style.left)
            $('.ui-slider-handle').mousedown()

            $('#nowTimeLine').css('left', `${change}%`) //时间线
            $('#circles-slider .ui-slider-range').width(`${change}%`) //时间条

            let totalTime = $('#nowTime').attr('data-t') * 60 //时间显示
            let nowTime = Math.floor(totalTime * (change / 100))

            let mo =
                String(Math.floor(nowTime / 60)).length == 1 ?
                `0${Math.floor(nowTime / 60)}` :
                Math.floor(nowTime / 60)
            let yu =
                String(nowTime % 60).length == 1 ?
                `0${nowTime % 60}` :
                nowTime % 60

            $('.ui-slider-handle').attr('data-t', nowTime)

            $('#nowTime').text(`${mo}:${yu}`)

            //预览
            const line = $('#nowTimeLine')

            $('#canvas')
                .children()
                .addClass('hidden')
            // .remove()
            //判断线与轨道元素在x轴是否重合
            for (const item of $('.silderBlock')) {
                if (that.checkHoverDiv(line, $(item))) {
                    let nameId = $(item).attr('data-i')
                    let showEle = $(`.canvasDiv[data-i='${nameId}'`)
                    showEle.removeClass('hidden')
                }
            }

            if (change == 0) {
                for (const item of $('.silderBlock')) {
                    if ($(item).css('left') == '0px') {
                        let nameId = $(item).attr('data-i')
                        let showEle = $(`.canvasDiv[data-i='${nameId}'`)
                        showEle.removeClass('hidden')
                    }
                }
            }
        }

        that.observer(el, obs, ['style'])
    }

    //绑定元素绘制 并生成轨道
    sliderEle(img, id) {
        let filename
        let trName
        let that = this
        let path = img[0].src
        // if (path.indexOf('/') > 0) {
        //     //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
        //     filename = path.substring(
        //         path.lastIndexOf('/') + 1,
        //         path.length
        //     )
        //     trName = filename
        // } else {
        //     filename = path
        //     trName = JSON.parse(img.attr('data-j')).materialName
        // }
        if (img.attr('data-j')) {
            filename = path
            trName = JSON.parse(img.attr('data-j')).materialName
        } else {
            filename = path
            trName = $('#itemIndex').find('option').eq($('#itemIndex').val() - 1).text()
        }

        let html = `
                <div class="silderBlock" data-s=${path} data-l='0' data-J='${img.attr(
                'data-J'
            )}' data-i="${id}" data-t=${$('#itemIndex').val()}>
                    ${trName}
                </div>
            `

        let lastTrack = $('.trackBox .track:last .trackContent')

        let index
        if (lastTrack.length != 0) {
            index = lastTrack.attr('id').substr(5)
        } else {
            index = 0
        }

        recursion(index)

        //递归查询空轨道并置入轨道
        function recursion(index) {
            // debugger
            index = Number(index)
            if (index == 1) {
                if ($(`#track${index}`).children().length == 0) {
                    $(`#track${index}`).append(html)
                    $(`#track${index}`)
                        .parent()
                        .find('.trackController')
                        .attr('data-t', $('#itemIndex').val())
                    return
                } else {
                    that.newTrack()
                    $(`#track${index + 1}`).append(html)
                    $(`#track${index + 1}`)
                        .parent()
                        .find('.trackController')
                        .attr('data-t', $('#itemIndex').val())
                    return
                }
            } else if (index == 0) {
                that.newTrack()
                $(`#track${index + 1}`).append(html)
                $(`#track${index + 1}`)
                    .parent()
                    .find('.trackController')
                    .attr('data-t', $('#itemIndex').val())
                return
            }

            if ($(`#track${index}`).children().length == 0) {
                if ($(`#track${index - 1}`).children().length == 0) {
                    recursion(index - 1)
                } else {
                    $(`#track${index}`).append(html)
                    $(`#track${index}`)
                        .parent()
                        .find('.trackController')
                        .attr('data-t', $('#itemIndex').val())
                    return
                }
            } else {
                that.newTrack()
                $(`#track${index + 1}`).append(html)
                $(`#track${index + 1}`)
                    .parent()
                    .find('.trackController')
                    .attr('data-t', $('#itemIndex').val())
                return
            }
        }

        //11.21新增轨道元素并绑定画布元素属性
        let canvasEle = $(`#canvas div[data-i="${id}"`)
        let sliderEle = $(`.trackBox .trackContent div[data-i="${id}"]`)

        //原始数据
        let dataJ = canvasEle.attr('data-j') == 'undefined' ? {} : JSON.parse(canvasEle.attr('data-j'))

        let data = {
            width: canvasEle.find('img').width(),
            height: canvasEle.find('img').height(),
            location_x: parseInt(canvasEle.css('left')),
            location_y: parseInt(canvasEle.css('top'))
        }

        sliderEle.attr(
            'data-p',
            JSON.stringify({
                ...dataJ,
                ...data
            })
        )

        //12.4新增轨道元素获取起止时间
        that.setTime(sliderEle)
    }

    //新建轨道
    newTrack(name) {
        // let indexT = $('.track').length +
        // debugger
        const nameId = new Date().getTime().toString()
        let indexT = 0
        for (const item of $('.trackContent')) {
            if (
                $(item)
                .attr('id')
                .slice(5) >= indexT
            ) {
                indexT =
                    Number(
                        $(item)
                        .attr('id')
                        .slice(5)
                    ) + 1
            }
        }

        let typeIndex = $('#itemIndex').val()
        let index = 1
        // for (const item of $('.track')) {
        //     //判断重复类型轨道
        //     if (
        //         $(item)
        //             .find('.trackController')
        //             .attr('data-t') == typeIndex
        //     ) {
        //         index++
        //     }
        // }

        // <div class="trackController col-sm-2" data-t=${typeIndex}>
        // <span>${this.typeIndex[typeIndex - 1]}</span>
        let html = `
                <div class="track clearfix" trackId=${nameId}>
                    <div class="trackController col-sm-2">
                        <span>${name || '轨道'+(indexT - 1)}</span>
                        <span class="glyphicon glyphicon glyphicon-align-justify" aria-hidden="true"></span>
                    </div>
                    <div id="track${indexT}" class="trackContent col-sm-10"></div>
                </div>
            `
        if ($('.trackSeize').length != 0) {
            $('.trackSeize')
                .eq(0)
                .remove()
        }

        if ($('.track').length != 0) {
            $('.track:last').after(html)
        } else {
            $('.trackBox').prepend(html)
        }
        // if (index != 1) {
        //     $('.track:last').after(html)
        // } else {
        //     $('.trackBox').prepend(html)
        // }

        // this.trackTypeObserver(
        //     $(`#track${indexT}`).prev('.trackController')[0]
        // )

        return $('.trackBox').find(`[trackId=${nameId}]`)
    }

    //在轨道上移动元素
    moveEle() {
        const THAT = this
        $('.trackBox').on('mousedown', '.silderBlock', function (e) {
            e.preventDefault()
            e.stopPropagation()
            const that = this

            let top = $(this).offset().top
            let left = $(this).offset().left
            let divW = $(this).width()
            let divH = $(this).height()

            let downX = e.clientX //鼠标落下X
            let eItemX = downX - left //鼠标距离元素左边界距离
            const oldEle = $(this).parent()

            const clone = $(this).clone()
            clone.appendTo($('.trackBox'))
            clone.css({
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: `${divW}px`,
                'z-index': 9999,
                opacity: 0.5
            })
            $(this).click()


            let moveE = function (e) {
                let nowX = e.clientX
                let nowY = e.clientY

                clone.css({
                    top: `${nowY - divH / 2}px`,
                    left: `${nowX - eItemX}px`
                })

                const nowEle = calcEle(e)
                if (nowEle) { //判断当前移动到的轨道 并加上高亮
                    $('.now-ele').removeClass('now-ele')
                    nowEle.addClass('now-ele')
                }
            }

            let upE = function (e) {
                e.stopPropagation()
                e.preventDefault()

                const nowEle = calcEle(e),
                    trackRect = that.parentNode.getBoundingClientRect(),
                    thatRect = that.getBoundingClientRect(),
                    eX = e.clientX, //鼠标点击距离左边界距离
                    trackX = trackRect.left, //轨道距离左边界距离
                    thisX = thatRect.left //元素距离左边界距离

                if (nowEle) {
                    if (nowEle.attr('id') == oldEle.attr('id')) { //轨道内移动
                        let flag = true
                        let trackEle = $(that).parent().children()
                        const oLeft = parseInt($(that).css('left'))

                        for (const it of trackEle) {
                            if ($(it).attr('data-i') == $(clone).attr('data-i')) continue
                            let nLeft

                            if (THAT.checkHoverDiv($(clone), $(it))) { //判断是否重合轨道内其他元素
                                if (THAT.checkHoverAround(clone, it) == 'left') {
                                    nLeft = parseInt($(it).css('left')) - $(clone).width()
                                    $(that).attr('data-l', nLeft)
                                    $(that).css('left', `${nLeft}px`)
                                    chackOther(oLeft, that, trackEle)
                                } else {
                                    nLeft = parseInt($(it).css('left')) + $(it).width() + 1
                                    $(that).attr('data-l', nLeft)
                                    $(that).css('left', `${nLeft}px`)
                                    chackOther(oLeft, that, trackEle)
                                }

                                flag = false
                            }
                        }

                        if (THAT.checkHoverDiv($(clone), nowEle.parent().find('.trackController'))) {
                            $(that).attr('data-l', 0)
                            $(that).css('left', `${0}px`)
                            chackOther(oLeft, that, trackEle)
                            flag = false
                        }

                        if (flag) {
                            $(that).attr('data-l', eX - trackX - eItemX)
                            $(that).css({
                                left: `${$(that).attr('data-l')}px`,
                            })
                        }
                    } else {
                        for (const item of $('.track')) {
                            //循环所有轨道 找到元素将移动的轨道
                            let copyId = $(that)
                                .parent()
                                .attr('id')
                            let itemId = $(item)
                                .children()
                                .eq(1)
                                .attr('id')
                            let itemChildren = $(item)
                                .children()
                                .eq(1)
                                .children()
                            let trackW = $(item)
                                .find('.trackContent')
                                .width() //轨道长度
                            let track = $(that)
                                .parent()
                                .parent()


                            if (
                                THAT.checkHover(e, $(item).find('.trackContent')) &&
                                copyId != itemId
                            ) {
                                //切换轨道
                                if (itemChildren.length != 0) {
                                    //判断轨道内是否有元素
                                    let leftAll = 0
                                    for (const i of itemChildren) {
                                        //有元素 获取最后一个元素的x定位
                                        let thisX =
                                            parseFloat($(i).css('left')) +
                                            $(i).width()
                                        if (thisX > leftAll) {
                                            leftAll = thisX
                                        }
                                    }

                                    $(that).attr('data-l', leftAll)

                                    $(item)
                                        .children()
                                        .eq(1)
                                        .append($(that))

                                    $(that).css({
                                        position: 'absolute',
                                        top: '0px',
                                        left: `${leftAll}px`,
                                        width: '5%',
                                        'z-index': '0'
                                    })

                                    THAT.removeTrack(track, that)
                                } else {
                                    //没元素 成为第一个元素

                                    $(item)
                                        .children()
                                        .eq(1)
                                        .append($(that))

                                    $(that).attr('data-l', '0')
                                    $(that).css({
                                        position: 'absolute',
                                        top: '0px',
                                        left: `0px`,
                                        'z-index': '0'
                                    })

                                    THAT.removeTrack(track, that)
                                    THAT.drawImg(
                                        $(that).attr('data-s'),
                                        $(that).attr('data-i'),
                                        0,
                                        0,
                                        $(that)
                                    )

                                    let tContent = $(that)
                                        .parent()
                                        .prev('.trackController')
                                    let thisType = $(that).attr('data-t')
                                    if (thisType != tContent.attr('data-t')) {
                                        let index = 1
                                        for (const item of $('.track')) {
                                            //判断重复类型轨道
                                            if (
                                                $(item)
                                                .find('.trackController')
                                                .attr('data-t') == thisType
                                            ) {
                                                index++
                                            }
                                        }

                                        tContent.attr('data-t', thisType)
                                    }
                                }
                                break
                            }
                        }
                    }
                }


                $(document).off('mousemove', moveE)
                $(document).off('mouseup', upE)
                clone.remove()
                $('.now-ele').removeClass('now-ele')
            }

            $(document).on('mouseup', upE)
            $(document).on('mousemove', moveE)
        })

        function calcEle(e) { //判断移动到哪条轨道
            for (const item of $('.track')) {
                if (THAT.checkHover(e, $(item))) {
                    return $(item).find('.trackContent')
                }
            }

            return false
        }

        function chackOther(oLeft, that, trackEle) {
            for (const ite of trackEle) {
                if ($(ite).attr('data-i') == $(that).attr('data-i')) continue

                if (THAT.checkHoverDiv($(that), $(ite))) {
                    $(that).attr('data-l', oLeft)
                    $(that).css('left', `${oLeft}px`)
                }
            }
        }
    }

    //移动轨道
    moveTrack() {
        let that = this
        $('.trackBox').on('mousedown', '.glyphicon', function (e) {
            e.preventDefault()
            e.stopPropagation()
            let thats = $(this)
                .parent()
                .parent()
            let copy = $(this)
                .parent()
                .parent()
                .clone()
            thats.after(copy)

            let top = $(copy).offset().top
            let left = $(copy).offset().left
            let divW = $(copy).width()
            let divH = $(copy).height()

            $(copy).css({
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: `${divW}px`,
                'z-index': 9999,
                'box-shadow': '5px 5px 5px #888888'
            })

            let moveE = function (e) {
                let nowX = e.clientX
                let nowY = e.clientY

                $(copy).css({
                    top: `${nowY - divH / 2}px`,
                    left: `${nowX - divW / 6}px`
                })
            }

            let upE = function (e) {
                e.stopPropagation()
                e.preventDefault()
                for (const item of $('.track')) {
                    // debugger
                    let copyId = thats
                        .children()
                        .eq(1)
                        .attr('id')
                    let itemId = $(item)
                        .children()
                        .eq(1)
                        .attr('id')

                    if (that.checkHover(e, $(item)) && copyId != itemId) {
                        //轨道拉到其他轨道上释放 将插入其下方

                        $(item).after($(thats))
                        $(thats).css({
                            position: 'initial'
                        })
                        $(copy).remove()
                    } else if (that.checkHover(e, $('.sliderContainer'))) {
                        //将轨道拉到时间线置顶
                        $('.trackBox')
                            .children()
                            .eq(0)
                            .before($(thats))
                        $(thats).css({
                            position: 'initial'
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

    //轨道元素点击事件 添加伸缩属性 读取元素信息
    flexEle() {
        let that = this

        $('#showBox').on('click', function () {
            $('#ediBox').addClass('hidden')
            $('#ediBox')
                .children()
                .addClass('hidden')
            $('#breadcrumb')
                .find('.active')
                .remove()
        })

        $('.trackBox').on('click', '.silderBlock', function (e) {
            let parent = this
            let trackL = $(this)
                .parent()
                .offset().left
            let trackW = $(this)
                .parent()
                .width()
            // let divW = $(this).width()
            // let divH = $(this).height()
            let thisT = $(this).attr('data-t')

            that.setTime($(this)) //获取起止时间到data属性上

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

            $('#ediBox').removeClass('hidden') //显示素材仓库
            $('#ediBox')
                .children()
                .addClass('hidden')
                .removeClass('activeEdi')
            $('#ediBox')
                .children()
                .eq(thisT - 1)
                .removeClass('hidden')
                .addClass('activeEdi')

            //填充起止时间
            // debugger
            $('#ediBox')
                .children()
                .eq(thisT - 1)
                .find('input[name="startTime"]')
                .val($('.checkEle').attr('data-begin'))
            $('#ediBox')
                .children()
                .eq(thisT - 1)
                .find('input[name="endTime"]')
                .val($('.checkEle').attr('data-end'))

            $('#breadcrumb')
                .find('.active')
                .remove() //显示仓库索引
            $('#breadcrumb').append(`
                    <li class="active">${that.typeIndex[thisT - 1]}</li>
                `)

            let dataId = $(this).attr('data-i')
            let trackEle = $('#canvas').find(`div[data-i=${dataId}]`)
            trackEle.click()

            that.setInput()

            $(this).on('mousedown', '.eleWidth', function (e) {
                //轨道元素拉伸属性
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

                    let trackE = $(parent)
                        .parent()
                        .find('.silderBlock')

                    for (const item of trackE) {
                        if (that.checkHover(e, $(item)) && item != parent) {
                            $(document).off('mousemove', moveE)
                            return
                        }
                    }

                    let nowW = parseFloat($(parent).css('width'))

                    if ($(eleW).hasClass('eleWidthR')) {
                        //右拉

                        if (
                            nowX > trackL &&
                            nowX < trackL + trackW &&
                            nowW >= 10
                        ) {
                            $(parent).css({
                                width: `${
                                        width + (nowX - left) < 10
                                            ? 10
                                            : width + (nowX - left)
                                    }`
                            })
                        }
                    } else {
                        //左拉
                        if (
                            nowX > trackL &&
                            nowX < trackL + trackW &&
                            nowW >= 10
                        ) {
                            let followX =
                                parseFloat($(parent).attr('data-l')) -
                                parseFloat(left - nowX)
                            $(parent).css({
                                width: `${
                                        width + (left - nowX) < 10
                                            ? 10
                                            : width + (left - nowX)
                                    }`,
                                left: `${followX}px`
                            })
                        }
                    }
                }

                let upE = function (e) {
                    e.preventDefault()
                    e.stopPropagation()

                    let nowX = e.clientX

                    $(parent).css({
                        width: `${$(parent).width()}`
                    })

                    $(document).off('mousemove', moveE)
                    $(document).off('mouseup', upE)
                }

                $(document).on('mouseup', upE)
                $(document).on('mousemove', moveE)
            })

            // //添加多选设置
            // if (e.ctrlKey) {
            //     if ($(this).hasClass('ctrlEle')) {
            //         $(this).removeClass('ctrlEle')
            //     } else {
            //         $(this).addClass('ctrlEle')
            //     }
            // }
        })

    }

    //设置起止时间
    setTime(el) {
        let that = this
        let track = el.parent()
        let timeS = $('#nowTime').attr('data-t') * 60 //时间轴总时间换算s
        let trackW = track.width()
        let elL = parseFloat(el.attr('data-l'))
        let elR = parseFloat(el.width()) + elL //元素左右长度

        let beginT = parseInt((elL / trackW) * timeS)
        let endT = parseInt((elR / trackW) * timeS)

        el.attr('data-begin', that.formatSeconds(beginT))
        el.attr('data-end', that.formatSeconds(endT))
    }

    //监听轨道类型变化(discard)
    trackTypeObserver(el) {
        // debugger
        let that = this
        var observer = new MutationObserver(function (mutations, observer) {
            mutations.forEach(function (mutation) {
                let target = $(mutation.target)
                let change = target.attr('data-t')
                let index = 0
                for (const item of $('.track')) {
                    if (
                        $(item)
                        .find('.trackController')
                        .attr('data-t') == change
                    ) {
                        index++
                    }
                }

                // target.children().eq(0).text(`${that.typeIndex[change - 1]}${index}`)
                target
                    .children()
                    .eq(0)
                    .text(`${that.typeIndex[change - 1]}`)
            })
        })
        var config = {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['data-t']
        }

        // let el = $('.trackController')[0]

        observer.observe(el, config)
    }

    //当轨道内没有元素时 删除轨道
    removeTrack(ele, item) {
        if (ele.find('.trackContent').children().length == 0) {
            ele.remove()

            let id = $(item).attr('data-i')
            $('#canvas')
                .find(`div[data-i=${id}]`)
                .addClass('hidden')
            // .remove()
        }

        if ($('.trackBox').children().length < 4) {
            $('.trackBox').append(`
                <div class="trackSeize clearfix">
                    <div class="trackController col-sm-2">
                        <span></span>

                    </div>
                    <div id="track0" class="trackContent col-sm-10"></div>
                </div>
                `)
        }
    }



    //点击图片或轨道读取信息填充到素材仓库中
    setInput() {

        const id = $('.checkEle').attr('data-i'),
            checkChild = $('.checkCanvas .canvasChild'),
            THAT = this
        let element = this.mapElement.get(id)
        let checkImg = $('#canvas').find(`[data-i=${id}]`).find('img, div'),
            flag = false,
            data
        if (!($('.checkEle').attr('data-p') == undefined)) {
            flag = true
            data = JSON.parse($('.checkEle').attr('data-p'))
            data.trans = (data.width / checkImg[0].naturalWidth).toFixed(2) * 100
        } else {
            let proxyObj = element._proxyObj
            checkImg = $('.itemBox').find(`[data-i=${$('.checkEle').attr('data-i')}]`).find('img')
            data = {
                location_x: proxyObj.x,
                location_y: proxyObj.y,
                width: proxyObj.width,
                height: proxyObj.height,
                trans: (proxyObj.width / element.dImg[0].naturalWidth).toFixed(2) * 100
            }
        }

        let index = parseInt($('.checkEle').attr('data-t'))
        let allEdi = $('#ediBox').children()
        let nowEdi
        for (const item of allEdi) {
            if (!$(item).hasClass('hidden')) {
                nowEdi = $(item)
            }
        }

        //点击获取x、y数据并填充
        nowEdi.find('input[name="location_x"]').val(data.location_x)
        nowEdi.find('input[name="location_y"]').val(data.location_y)

        //点击获取宽、高数据并填充
        nowEdi.find('input[name="width"]').val(data.width || checkChild.width())
        nowEdi.find('input[name="height"]').val(data.height || checkChild.height())

        const setInputTool = new SetInput(data, nowEdi)

        if (flag) {
            switch (index) {
                case 1:
                    setInputTool.index1()
                    break;
                case 2:
                    setInputTool.index2()
                    break;
                case 3:
                    setInputTool.index3()
                    break;
                case 4:
                    setInputTool.index4()
                    break;
                case 5:
                    setInputTool.index5()
                    break;
                case 6:
                    setInputTool.index6()
                    break;
                case 7:
                    setInputTool.index7()
                    break;
                case 8:
                    setInputTool.index8()
                    break;
                case 9:
                    setInputTool.index9()
                    break;
                case 11:
                    setInputTool.index11()
                    break;

            }
        }

        //原始缩放比
        const scaleN = element.dDiv.find('img').length == 0 ? 256 / 128 : element.dImg[0].naturalWidth / element.dImg[0].naturalHeight
        //当前缩放比
        const scale = element.dDiv.find('img').length == 0 ? 256 / 128 : element.dImg.width() / element.dImg.height()
        let trans
        //点击获取缩放并填充设置
        if (nowEdi.find('input[name="zoomInput"]').length !== 0 && Math.abs(scaleN - scale) < 0.01) {
            trans = data.trans
            nowEdi.find('input[name="zoomInput"]').val(trans)

            //  更改缩放比
            $('.activeEdi .zoom .ui-slider-tip').text(trans)
            $('.activeEdi .zoom .ui-slider-handle').css(
                'left',
                `${(100 / 500) * trans}%`
            )
        }

    }

    //缩略时间轴
    //初始化滑块
    abbrTrack() {
        $('#abbr-slider')
            .slider({
                min: 0,
                max: 100,
                range: false
            })

            .slider('pips', {
                first: 'pip',
                last: 'pip',
                rest: false
            })

        this.abbrBind()
        this.abbrSet()
    }

    //绑定时间轴
    abbrBind() {
        $('#abbr-slider')
            .find('.ui-slider-handle')
            .css('left', '10%')

        var el = $('#abbr-slider').find('.ui-slider-handle')[0]

        function obs(mutation) {
            //监听缩略时间轴变化

            let change = parseFloat(mutation.target.style.left) / (100 / 24)

            $('#nowTime').attr('data-t', 60 * change)

            $('.ui-slider-handle').mousedown()

            let times = $('#nowTime').attr('data-t')
            let timeNow = $('#nowTime').text()
            let timeArr = $('#nowTime')
                .text()
                .split(':')
            let timeS = timeArr[0] * 60 + timeArr[1]
            let timePer = timeS / (times * 60)

            $('#circles-slider .ui-slider-handle').css(
                'left',
                `${timePer <= 100 ? timePer : 100}%`
            )
        }

        this.observer(el, obs, ['style'])
    }

    //实时监听当前时间
    abbrSet() {
        $('#nowTime').on('click', function () {
            let val = $('#nowTime').attr('data-t')
            let html = `
                    <input id="setAbbr" type="text" class="form-control" style="position: absolute;top: -12px;width: 100px;height: 34px;">
                `

            $(this).after(html)
            $('#setAbbr').val(`${val}`)

            $('#setAbbr').on('blur', function () {
                $('#nowTime').attr('data-t', $(this).val())
                $('#circles-slider .ui-slider-handle').css('left', '100%')

                $('#nowTime').text(`${$(this).val()}:00`)

                $(this).remove()
            })
        })
    }

    //素材仓库
    //素材仓库初始化
    repertory() {
        let bodyH = document.body.clientHeight
        const THAT = this
        // let height = bodyH - $('#myTab').height()
        let top =
            $('#myTab').height() +
            $('.breadcrumb').height() +
            parseFloat($('.breadcrumb').css('padding-top')) +
            parseFloat($('.breadcrumb').css('padding-bottom'))
        let height = bodyH - top
        let contentH = bodyH - $('#myTab').height()

        $('#myTabContent').css('height', contentH)
        $('#ediBox').css({
            height: height,
            top: top
        })

        $('.checkInit').bootstrapSwitch()



        const repertory = new RepertoryTool(THAT)



        this.saveEdi()
        this.setPlayTime()

        //滑块元素初始化
        $('.zoom')
            .slider({
                min: 1,
                max: 500,
                range: false
            })
            .slider('pips', {
                rest: false
            })
            .slider('float')

        let el = $('#ediBox').find('.ui-slider-handle')

        el.parent()
            .next()
            .find('input[name="zoomInput"]')
            .val(100)

        el.css('left', `${(100 / 500) * 100}%`)
        el.find('.ui-slider-tip').text(100)

        // this.ediInit()
    }

    //各种属性关联(discard)
    ediInit() {
        let that = this
            //通用初始化

            //关联缩放
            !(function () {
                let el = $('.zoom').find('.ui-slider-handle')

                el.parent()
                    .next()
                    .find('input[name="zoomInput"]')
                    .val(100)
                el.css('left', `${(100 / 500) * 100}%`)
                el.find('.ui-slider-tip').text(100)

                for (const item of el) {
                    // debugger
                    el = item

                    function obs(mutation) {

                        el = mutation.target
                        let canvasCheck = $(
                            `.canvasDiv[data-i='${$('.checkCanvas').attr(
                                'data-i'
                            )}'`
                        ).find('.canvasChild')

                        //关联宽高框
                        $('.activeEdi')
                            .find('input[name="width"]')
                            .val(parseInt(canvasCheck.width()))
                        $('.activeEdi')
                            .find('input[name="height"]')
                            .val(parseInt(canvasCheck.height()))

                        if (
                            that.constrain.indexOf(
                                $('.checkEle').attr('data-t')
                            ) != -1
                        ) {
                            return
                        }

                        let textV = $(el)
                            .find('.ui-slider-tip')
                            .text()

                        $(el)
                            .parent()
                            .next()
                            .find('input[name="zoomInput"]')
                            .val(textV)

                        let trans = textV / 100
                        let nWidth = canvasCheck[0].naturalWidth
                        let nHeight = canvasCheck[0].naturalHeight

                        //锁定缩放最大值
                        if (nWidth * trans >= that.width) {
                            return
                        } else if (nHeight * trans >= that.height) {
                            return
                        }

                        canvasCheck.css({
                            width: nWidth * trans,
                            height: nHeight * trans
                        })

                        that.setDataJ(
                            ['width', 'height', 'scalingRatio'],
                            [nWidth * trans, nHeight * trans, textV]
                        )
                    }


                    that.observer(el, obs, ['style'])

                    $(el)
                        .parent()
                        .next()
                        .find('input[name="zoomInput"]')
                        .on('change', function () {

                            let canvasCheck = $(
                                `.canvasDiv[data-i='${$('.checkCanvas').attr(
                                    'data-i'
                                )}'`
                            ).find('.canvasChild')
                            let inputV = $(this).val()
                            let trans = inputV / 100
                            if (inputV < 1) {
                                $(this).val(1)
                            } else if (inputV > 500) {
                                $(this).val(500)
                            }
                            let slider = $(this)
                                .parent()
                                .prev()
                            slider
                                .find('.ui-slider-tip')
                                .text(parseInt($(this).val()))
                            slider
                                .find('.ui-slider-handle')
                                .css('left', `${(inputV / 500) * 100}%`)

                            // $('.checkCanvas').css('transform', `scale(${trans}, ${trans})`)

                            let nWidth = canvasCheck[0].naturalWidth
                            let nHeight = canvasCheck[0].naturalHeight

                            let tHeight = nHeight * (that.imgWidth / nWidth)

                            canvasCheck.css({
                                width: that.imgWidth * trans,
                                height: tHeight * trans
                            })

                            //关联宽高框
                            $('.activeEdi')
                                .find('input[name="width"]')
                                .val(parseInt($('.checkCanvas').width()))
                            $('.activeEdi')
                                .find('input[name="height"]')
                                .val(parseInt($('.checkCanvas').height()))
                        })
                }
            })()

            //关联x、y变更
            !(function () {
                $('input[name="location_x"]').on('change', function () {
                    let thisV = $(this).val()
                    let imgE = $(
                        `.canvasDiv[data-i='${$('.checkCanvas').attr(
                            'data-i'
                        )}'`
                    ).find('.canvasChild')
                    let trueW = that.width - imgE.width()

                    if (thisV < 0) {
                        thisV = 0
                        $(this).val(0)
                    } else if (thisV > trueW) {
                        thisV = trueW
                        $(this).val(trueW)
                    }

                    $('.checkCanvas').css('left', thisV)

                    that.setDataJ(['location_x'], [thisV])
                })

                $('input[name="location_y"]').on('change', function () {
                    let thisV = $(this).val()
                    let imgE = $(
                        `.canvasDiv[data-i='${$('.checkCanvas').attr(
                            'data-i'
                        )}'`
                    ).find('.canvasChild')
                    let trueH = that.height - imgE.height()

                    if (thisV < 0) {
                        thisV = 0
                        $(this).val(0)
                    } else if (thisV > trueH) {
                        thisV = trueH
                        $(this).val(trueH)
                    }

                    $('.checkCanvas').css('top', $(this).val())

                    that.setDataJ(['location_y'], [$(this).val()])
                })
            })()

            //关联宽高设置
            !(function () {
                $('input[name="width"]').on('change', function () {
                    let thisV = $(this).val()
                    let imgE = $(
                        `.canvasDiv[data-i='${$('.checkCanvas').attr(
                            'data-i'
                        )}'`
                    ).find('.canvasChild')
                    let trans = imgE[0].naturalWidth / imgE[0].naturalHeight

                    if (thisV < 0) {
                        thisV = 0
                        $(this).val(0)
                    } else if (thisV > that.imgWidth * 5) {
                        thisV = that.imgWidth * 5
                        $(this).val(that.imgWidth * 5)
                    }

                    let heightV
                    if (
                        that.constrain.indexOf($('.checkEle').attr('data-t')) !=
                        -1
                    ) {
                        heightV = parseInt(thisV / trans)
                    } else {
                        heightV = imgE.height()
                    }

                    imgE.css({
                        width: thisV,
                        height: heightV
                    })

                    $(this)
                        .parent()
                        .parent()
                        .next()
                        .find('input[name="height"]')
                        .val(heightV)

                    $('.activeEdi')
                        .find('input[name="zoomInput"]')
                        .val((thisV / that.imgWidth).toFixed(2) * 100)
                    // .change()

                    let transN = (thisV / that.imgWidth).toFixed(2) * 100

                    $('.activeEdi .zoom .ui-slider-tip').text(transN)
                    $('.activeEdi .zoom .ui-slider-handle').css(
                        'left',
                        `${(100 / 500) * transN}%`
                    )

                    that.setDataJ(['width', 'height', 'scalingRatio'], [thisV, heightV, transN])
                })

                $('input[name="height"]').on('change', function () {
                    let thisV = $(this).val()
                    let imgE = $(
                        `.canvasDiv[data-i='${$('.checkCanvas').attr(
                            'data-i'
                        )}'`
                    ).find('.canvasChild')
                    let trans = imgE[0].naturalWidth / imgE[0].naturalHeight
                    let transH = that.imgWidth / trans

                    if (thisV < 0) {
                        thisV = 0
                        $(this).val(0)
                    } else if (thisV > that.imgWidth * 5) {
                        thisV = that.imgWidth * 5
                        $(this).val(that.imgWidth * 5)
                    }

                    let widthV
                    if (
                        that.constrain.indexOf($('.checkEle').attr('data-t')) !=
                        -1
                    ) {
                        widthV = parseInt(thisV / trans)
                    } else {
                        widthV = imgE.width()
                    }

                    imgE.css({
                        width: widthV,
                        height: thisV
                    })

                    $(this)
                        .parent()
                        .parent()
                        .prev()
                        .find('input[name="width"]')
                        .val(widthV)

                    $('.activeEdi')
                        .find('input[name="zoomInput"]')
                        .val((thisV / transH).toFixed(2) * 100)
                    // .change()

                    let transN = (thisV / transH).toFixed(2) * 100

                    $('.activeEdi .zoom .ui-slider-tip').text(transN)
                    $('.activeEdi .zoom .ui-slider-handle').css(
                        'left',
                        `${(100 / 500) * transN}%`
                    )

                    that.setDataJ(['width', 'height', 'scalingRatio'], [widthV, thisV, transN])
                })
            })()
    }

    //同步设置选中轨道元素data-j值
    setDataJ(keys, vals, id) {
        let checkEle =
            id == undefined ?
            $('.checkEle') :
            $('.trackBox').find(`div[data-i=${id}]`)

        let dataJ =
            checkEle.attr('data-p') == undefined ? {} :
            JSON.parse(checkEle.attr('data-p'))

        keys.forEach((item, i) => {
            dataJ[item] = vals[i]
        })

        checkEle.attr('data-p', JSON.stringify(dataJ))
    }

    //设置保存参数
    saveEdi() {


        for (const item of $('#ediBox').children()) {
            const $item = $(item)

            $item.find('form').on('change', function () {
                switch ($item.attr('id')) {
                    case 'imgEdi':
                        SaveTool.cImg()
                        break;
                    case 'videoEdi':
                        SaveTool.cVideo()
                        break;
                    case 'audioEdi':
                        SaveTool.cAudio()
                        break;
                    case 'textEdi':
                        SaveTool.cText()
                        break;
                    case 'rtspEdi':
                        SaveTool.cRtsp()
                        break;
                    case 'tableEdi':
                        SaveTool.cTable()
                        break;
                    case 'clockEdi':
                        SaveTool.cClock()
                        break;
                    case 'weatherEdi':
                        SaveTool.cWeather()
                        break;
                    case 'htmlEdi':
                        SaveTool.cHtml()
                        break;
                    case 'documentEdi':
                        SaveTool.cDocument()
                        break;
                    case 'imgBoxEdi':
                        SaveTool.cImgbox()
                }
            })
        }


    }

    //监听video进度设置
    setPlayTime() {
        let that = this
        setPlay($('#videoEdi'), '#video-slider')
        setPlay($('#audioEdi'), '#audio-slider')

        function setPlay(form, id) {
            let el = form.find(id).find('.ui-slider-range')[0]

            function obs(mutation) {
                let timeL = parseFloat(
                    JSON.parse($('.checkEle').attr('data-J')).duration
                )
                let style = mutation.target.style
                let left = parseInt(style.left)
                let right = parseInt(style.left) + parseInt(style.width)

                let startT = (timeL * left) / 100
                let endT = (timeL * right) / 100

                form.find('.videoPlayTime')
                    .eq(0)
                    .val(that.formatSeconds(startT))
                form.find('.videoPlayTime')
                    .eq(1)
                    .val(that.formatSeconds(endT))
            }

            that.observer(el, obs, ['style'])

            form.find('.videoPlayTime').on('blur', function () {
                let str = $(this)
                    .val()
                    .trim()

                let reg = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
                if (!reg.test(str)) {
                    let html = `
                            <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                                请输入正确的格式
                                如 00:00:00
                            </div>
                            `

                    $(this).after(html)

                    setTimeout(() => {
                        $('.alert').alert('close')
                    }, 3000)

                    $(this).val('')
                } else {
                    let thisV = $(this).val()
                    let indexF = thisV.indexOf(':')
                    let ele = $(id).find('.ui-slider-handle')
                    let range = $(id).find('.ui-slider-range')

                    let h = Number(thisV.slice(0, indexF))
                    let m = Number(thisV.slice(indexF + 1, indexF + 3))
                    let s = Number(thisV.slice(indexF + 4, indexF + 6))

                    let timeS = h * 60 + m * 60 + s

                    let timeA = JSON.parse($('.checkEle').attr('data-J'))
                        .duration
                    if ($(this).attr('name') == 'startPlay') {
                        let timeSe = timeS / timeA

                        ele.eq(0).css('left', `${timeSe * 100}%`)
                        range.css({
                            left: `${timeSe * 100}%`,
                            width: `${(parseFloat(ele.eq(1).css('left')) /
                                    $(id).width() -
                                    timeSe) *
                                    100}%`
                        })
                    } else {
                        let timeSe = timeS / timeA

                        ele.eq(1).css('left', `${timeSe * 100}%`)
                        range.css({
                            width: `${(timeSe -
                                    parseFloat(ele.eq(0).css('left')) /
                                        $(id).width()) *
                                    100}%`
                        })
                    }
                }
            })
        }
    }

    //获取素材并分类
    getMaterial() {
        let that = this

        function getMate() {
            let thats = $('#itemIndex')
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: that.api.material,
                data: {
                    areaId: that.areaId,
                    materialType: thats.val(),
                    searchValue: '',
                    groupName: $('#groupIndex').val()
                },
                success(res) {
                    if (res.success) {
                        let html = ''
                        let thisVal = thats.val()
                        if (
                            thisVal == 4 ||
                            thisVal == 5 ||
                            thisVal == 6 ||
                            thisVal == 7 ||
                            thisVal == 8 ||
                            thisVal == 9 ||
                            thisVal == 11
                        ) {
                            html += `
                                    <img class="material defaultAdd " src="img/add/add.png">
                                `
                        }

                        if (res.materialList.length != 0) {
                            for (const item of res.materialList) {
                                if (item.thumbnail == null) {
                                    html += `
                                        <img options='text=${
                                            item.materialName
                                        }' class='material placeholder'  data-J='${JSON.stringify(
                                            item
                                        )}'>
                                        `
                                } else {
                                    // 缩略图路径处理
                                    let url
                                    if (that.NODE_ENV == 'development') {
                                        url = `img/${
                                            item.thumbnail
                                        }`
                                    } else {
                                        url = `/images/thumbnail/material/${
                                            item.thumbnail
                                        }`
                                    }

                                    html += `
                                        <div class='item-container'>
                                            <img src="${url}" class="material" data-J='${JSON.stringify(
                                                item
                                            )}'>
                                            <p>${item.materialName}</p>
                                        </div>
                                        `
                                }
                            }
                        }

                        $('#itemList')
                            .children()
                            .hide()
                        $('#itemList').append(html)
                        $('#itemList')
                            .find(`img[data-t=${thisVal}]`)
                            .show()
                        placeholder.render()
                    } else {
                        alert(res.msg)
                    }
                }
            })
        }

        $('#itemIndex').on('change', function () {
            getMate()
        })

        $('#groupIndex').on('change', function () {
            getMate()
        })

        getMate()
    }

    //模版
    //模版初始化
    templateInit() {
        this.getTemplate()
        this.readTemplate()
    }

    //获取模版
    getTemplate() {
        let that = this
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: that.api.template,
            data: {
                areaId: that.areaId,
                searchValue: ''
            },
            success(res) {
                let html = ''

                for (const item of res.templateList) {
                    // 缩略图路径处理
                    let url = `/images/thumbnail/template/${item.thumbnail}`

                    html += `
                            <img src="${url}" class="material" data-J='${JSON.stringify(
                            item
                        )}'>
                            `
                }

                $('#templateList').append(html)
            }
        })
    }

    //读取模版
    readTemplate() {
        let that = this
        $('#templateList').on('click', 'img', function () {
            var r = confirm('确定读取该模版？')
            if (r == true) {
                let data = JSON.parse($(this).attr('data-j'))
                let listIndex = [
                    'imageList',
                    'videoList',
                    'audioList',
                    'textList',
                    'rtspList',
                    'tableList',
                    'clockList',
                    'weatherList',
                    'htmlList',
                    'documentList'
                ]
                let html = ''
                let timeA = $('#nowTime').attr('data-t') * 60
                let IdIndex = new Date().getTime().toString()
                let trackW = $('.trackContent').width()

                $('#canvas')
                    .children()
                    .remove() //清空画布

                for (const item of data.params) {
                    let dataSort = item.layerList.sort(compare('zAxis')) // 对z轴进行排序

                    dataSort.forEach((it, index) => {
                        let eleHtml = ''
                        for (const i of it[listIndex[it.type - 1]]) {
                            let beginL = calcTime(i.beginTime) / timeA
                            let endL = calcTime(i.endTime) / timeA
                            let width =
                                (endL - beginL) * $('.trackContent').width()
                            let nameId = IdIndex++

                            eleHtml += `
                                <div class="silderBlock" data-s="${
                                    i.fileName
                                }" data-l=${beginL *
                                    trackW} data-j=${JSON.stringify(
                                    i
                                )} data-i=${nameId} data-t="${
                                    it.type
                                }" data-begin="${i.beginTime}" data-end="${
                                    i.endTime
                                }" style="left: ${beginL *
                                    100}%; width: ${width}px">
                                    ${i.materialName}
                                </div>
                                `
                        }

                        html += `
                            <div class="track clearfix" data-j=${JSON.stringify(
                                it
                            )}>
                                <div class="trackController col-sm-2" data-t=${
                                    it.type
                                }>
                                    <span>${that.typeIndex[it.type - 1]}</span>
                                    <span class="glyphicon glyphicon glyphicon-align-justify" aria-hidden="true"></span>
                                </div>
                                <div id="track${index +
                                    1}" class="trackContent col-sm-10">
                                    ${eleHtml}
                                </div>
                            </div>
                            `
                    })

                    if (item.layerList.length < 4) {
                        //轨道不到四条 添加预留轨道
                        for (
                            let i = 0; i < 4 - item.layerList.length; i++
                        ) {
                            html += `
                                <div class="trackSeize clearfix">
                                    <div class="trackController col-sm-2">
                                        <span></span>

                                    </div>
                                    <div id="track0" class="trackContent col-sm-10"></div>
                                </div>
                                `
                        }
                    }
                }

                $('.trackBox').html(html)

                for (const item of $('.track .trackContent')) {
                    let firstO = {
                        left: 0,
                        index: ''
                    }

                    for (const i of $(item).children()) {
                        let iLeft = calcTime($(i).attr('data-begin'))
                        if (iLeft <= firstO.left) {
                            firstO = {
                                left: iLeft,
                                index: i
                            }
                        }
                    }

                    let dataI = $(firstO.index).attr('data-i')
                    let data = JSON.parse($(firstO.index).attr('data-j'))
                    let trackData = JSON.parse(
                        $(firstO.index)
                        .parent()
                        .parent()
                        .attr('data-j')
                    )

                    that.drawImg(
                        data.fileName,
                        dataI,
                        trackData.location_x,
                        trackData.location_y,
                        $(firstO.index),
                        trackData.width,
                        trackData.height
                    )
                }
            }
        })

        function calcTime(thisV) {
            let indexF = thisV.indexOf(':')

            let h = Number(thisV.slice(0, indexF))
            let m = Number(thisV.slice(indexF + 1, indexF + 3))
            let s = Number(thisV.slice(indexF + 4, indexF + 6))

            let timeS = h * 60 + m * 60 + s
            return timeS
        }

        function compare(prop) {
            //数组对象排序
            return function (obj1, obj2) {
                var val1 = obj1[prop]
                var val2 = obj2[prop]
                if (val1 < val2) {
                    return -1
                } else if (val1 > val2) {
                    return 1
                } else {
                    return 0
                }
            }
        }
    }

    //保存
    // 保存初始化
    save() {
        let that = this

        console.log($option)
        if ($option.data) {
            $('#saveBtnPro').hide()
            $('#saveEdiBtnPro').show()
        } else {
            $('#saveBtnPro').show()
            $('#saveEdiBtnPro').hide()
        }

        $('#save').on('click', function () {
            $('#savePro').modal('show')
        })

        $('#saveBtnPro').on('click', function () {
            //保存为节目
            if (
                $('#saveForm')
                .find('.required')
                .val() == ''
            ) {
                alert('请填写名称')
                return
            }

            let data = that.getParams('pro')
            data.programName = $('#saveForm')
                .find('input[name="programName"]')
                .val()
            data.note = $('#saveForm')
                .find('input[name="note"]')
                .val()

            html2canvas($('#canvas'), {
                height: $('#canvas').outerHeight() + 20,
                width: $('#canvas').outerWidth() + 20,
                onrendered: function (canvas) {
                    data.photo = canvas.toDataURL()
                    console.log(data)
                    $.ajaxJson({
                        url: that.api.save,
                        type: 'POST',
                        dataType: 'json',
                        data,
                        success(res) {
                            if (res.success) {
                                alert('成功')
                            } else {
                                alert(res.msg)
                            }
                        }
                    })
                }
            })
        })

        $('#saveEdiBtnPro').on('click', function () {
            //编辑节目
            if (
                $('#saveForm')
                .find('.required')
                .val() == ''
            ) {
                alert('请填写名称')
                return
            }

            let data = that.getParams('pro')
            data.programName = $('#saveForm')
                .find('input[name="programName"]')
                .val()
            data.note = $('#saveForm')
                .find('input[name="note"]')
                .val()
            data.programId = $option.data.programId

            html2canvas($('#canvas'), {
                height: $('#canvas').outerHeight() + 20,
                width: $('#canvas').outerWidth() + 20,
                onrendered: function (canvas) {
                    data.photo = canvas.toDataURL()
                    console.log(data)
                    $.ajaxJson({
                        url: that.api.saveEdi,
                        type: 'POST',
                        dataType: 'json',
                        data,
                        success(res) {
                            if (res.success) {
                                alert('成功')
                                localStorage.setItem('save', new Date().getTime())
                                window.open("about:blank","_self").close()  
                            } else {
                                alert(res.msg)
                            }
                        }
                    })
                }
            })
        })

        $('#saveBtnTem').on('click', function () {
            //保存为模版
            if (
                $('#saveForm')
                .find('.required')
                .val() == ''
            ) {
                alert('请填写名称')
                return
            }

            let data = that.getParams('tem')
            data.templateName = $('#saveForm')
                .find('input[name="programName"]')
                .val()
            data.note = $('#saveForm')
                .find('input[name="note"]')
                .val()

            html2canvas($('#canvas'), {
                height: $('#canvas').outerHeight() + 20,
                width: $('#canvas').outerWidth() + 20,
                onrendered: function (canvas) {
                    data.photo = canvas.toDataURL()

                    $.ajax({
                        url: that.api.savetemplate,
                        type: 'POST',
                        dataType: 'json',
                        data,
                        success(res) {
                            if (res.success) {
                                alert('成功')
                            } else {
                                alert(res.msg)
                            }
                        }
                    })
                }
            })
        })
    }

    //序列化素材参数
    getParams(type) {
        let elList = [
            'imageList',
            'videoList',
            'audioList',
            'textList',
            'respList',
            'tableList',
            'clockList',
            'weatherList',
            'htmlList',
            'documentList'
        ]
        let that = this

        let data = {}
        let form = $('#saveForm')

        data.programName = form.find('input[name="programName"]').val()
        data.note = form.find('input[name="note"]').val()

        data.duration
        data.params = []

        for (let i = 0; i < $('.track').length; i++) {
            let parObj = {}
            parObj.elementList = []
            let durFlag = 0
            //循环轨道
            let e = $('.track')[i]
            let track = $(e).find('.trackContent')
            // layerObj.imageList = []
            // layerObj.zAxis = i

            // for (const item of elList) {
            //     layerObj[item] = []
            // }

            for (let it = 0; it < $(track).children().length; it++) {

                let layerObj = {}

                //循环轨道元素
                let trackChildObj = {}
                let el = $(track).children()[it]
                layerObj.elementType = $(el)
                    .attr('data-t')

                trackChildObj =
                    $(el).attr('data-p') == undefined ?
                    JSON.parse($(el).attr('data-j')) :
                    JSON.parse($(el).attr('data-p'))

                // 寻找轨道相关画布图片
                for (const ite of $('.canvasDiv')) {
                    if ($(ite).attr('data-i') == $(el).attr('data-i')) {
                        let img = $(ite).find('img')
                        let checkEle = $(
                            `.trackContent [data-i="${$(ite).attr('data-i')}"]`
                        )

                        layerObj.location_y = parseInt($(ite).css('top'))
                        layerObj.location_x = parseInt($(ite).css('left'))
                        layerObj.width = parseInt(img.css('width'))
                        layerObj.height = parseInt(img.css('height'))
                        layerObj.beginTime = checkEle.attr('data-begin')
                        layerObj.endTime = checkEle.attr('data-end')
                        layerObj.index = it
                    }
                }

                // layerObj[elList[layerObj.type]].push(trackChildObj)
                Object.assign(layerObj, trackChildObj)

                // 获取持续时间
                if (
                    parseFloat($(el).css('left')) +
                    parseFloat($(el).css('width')) >
                    durFlag
                ) {
                    durFlag =
                        parseFloat($(el).css('left')) +
                        parseFloat($(el).css('width'))

                    let allTime = $('#nowTime').attr('data-t') * 60
                    let allLength = $('.trackContent').width()

                    data.duration = that.formatSeconds(
                        allTime * (durFlag / allLength)
                    )
                }

                data.scalingRatio = parseInt($('#transformCanvas').val())

                let copy = {
                    beginTime: layerObj.beginTime,
                    endTime: layerObj.endTime,
                    elementType: layerObj.elementType
                }

                delete layerObj.beginTime
                delete layerObj.endTime
                delete layerObj.elementType

                copy.elementData = layerObj
                parObj.elementList.push(copy)
            }

            parObj.trackName = $(e).find('.trackController span').eq(0).text()
            parObj.index = i
            
            //TODO：params过滤无效信息
            data.params.push(parObj)
        }

        // for (let i = 0; i < $('.track').length; i++) {
        //     const item = $('.track')[i]

        //     // 保存各轨道元素参数
        //     let trackController = $(item).find('.trackController')
        //     let layer = {}
        //     layer.zAxis = i
        //     layer.type = trackController.attr('data-t')
        //     layer.location_y = trackController.attr('data-i')

        //     // 获取起止时间
        //     let beginTime = 0
        //     let endTime = 0
        //     for (
        //         let itIndex = 0;
        //         itIndex < $('.silderBlock').length;
        //         itIndex++
        //     ) {
        //         const it = $('.silderBlock')[itIndex]

        //         // 筛选第一个和最后一个轨道元素
        //         let startT = that.formatToS($(it).attr('data-begin'))
        //         let endT = that.formatToS($(it).attr('data-end'))

        //         if (startT < beginTime) {
        //             beginTime = startT
        //         }
        //         if (endT > endTime) {
        //             endTime = endT
        //         }
        //     }

        //     // parObj.beginTime = that.formatSeconds(beginTime)
        //     // parObj.endTime = that.formatSeconds(endTime)
        // }


        // data.params = JSON.stringify(data.params)

        Object.assign(data, that.proObj)

        if (type == 'pro') {
            data.programCode = $('#saveForm')
                .find('input[name="code"]')
                .val()
        } else {
            data.templateCode = $('#saveForm')
                .find('input[name="code"]')
                .val()
        }

        return data
    }

    //其他方法
    btnBind() {
        //按钮绑定事件
        const that = this

        $('#addTrack').on('click', function () {
            //添加轨道按钮
            that.newTrack()
        })

        //监听del键盘事件
        $(document).on('keydown', function (e) {
            var code = e.keyCode
            if (46 == code) {
                let track = $('.checkEle')
                    .parent()
                    .parent()

                //修改完成后恢复
                // that.absorb.deleteMap($('.checkCanvas')[0])

                $('.checkEle').remove()
                $('#showBox').click()

                let trackEle = track.find('.trackContent').children()
                if (trackEle.length == 0) {
                    $('.checkCanvas').remove()
                } else {
                    let firstL = 999999999
                    let firstE
                    for (const item of trackEle) {
                        let length = $(item).attr('data-l')
                        if (parseFloat(length) < firstL) {
                            firstL = length
                            firstE = item
                        }
                    }

                    $('.checkCanvas')
                        .find('img')
                        .attr('src', $(firstE).attr('data-s'))
                }

                that.removeTrack(track, $('.checkEle')[0])
            }
        })


    }

    //设置canvas缩放
    setTransform() {
        const THAT = this
        let clinenW = document.body.clientWidth
        let clinenH = document.body.clientHeight

        let width = clinenW - $('.row-right').width()
        let ratio =
            (width / this.width).toFixed(1) < 1 ?
            (width / this.width).toFixed(1) * 10 :
            10


        $('#canvas').css(
            'transform',
            `scale(${0.1 * ratio}, ${0.1 * ratio})`
        )
        $('#transformCanvas').val(ratio)

        $('#transformCanvas').on('change', function () {
            $('#canvas').css(
                'transform',
                `scale(${0.1 * $(this).val()}, ${0.1 * $(this).val()})`
            )

            if (0.1 * $(this).val() * THAT.height < $('#hiddenBox').height()) {
                $('#hiddenBox').css('overflow-y', 'hidden')
            } else {
                $('#hiddenBox').css('overflow-y', 'auto')
            }

            if (0.1 * $(this).val() * THAT.width < $('#hiddenBox').width()) {
                $('#hiddenBox').css('overflow-x', 'hidden')
            } else {
                $('#hiddenBox').css('overflow-x', 'auto')
            }
        })
    }

    //计算div宽高
    styleInit() {
        let clinenW = document.body.clientWidth
        let clinenH = document.body.clientHeight

        $('.timeLineBox').css('height', $('.timeLine').height() + 14)

        // $('.row-left').css({
        //     width: `${clinenW - $('.row-right').width()}`,
        //     height: `${clinenH - $('.timeLineBox').height()}`
        // })

        $('.ef-ruler').css({
            height: `${$('#ruler').height() + 25}`
        })

        //计算hiddenBox宽高

        $('#hiddenBox').css({
            width: `${clinenW - $('.row-right').width() - 60}`,
            height: `${clinenH -
                    $('.timeLineBox').height() -
                    parseInt($('.row-left').css('paddingTop')) -
                    30}`
        })
    }

    //批量设置长度
    setPlayLength() {
        let that = this

        $(document).keyup(function (event) {
            if (event.keyCode == 9) {
                $('#addTime').val('')
                let ctrlEle = $('.ctrlEle')
                $('#setPlayLength').modal('show')
            }
        })

        $('#setPlayBtn').on('click', function () {
            let ctrlEle = $('.ctrlEle')
            let addTime = $('#addTime').val()
            let timeTotal = $('#nowTime').attr('data-t') * 60
            let addLength =
                (addTime / timeTotal) * $('.trackContent').width()

            ctrlEle.width(addLength)
            for (const item of ctrlEle) {
                let track = $(item).parent()
                let div = $(item)

                for (const i of track.children()) {
                    let item1 = $(i)
                    if (item1.attr('data-i') != div.attr('data-i')) {
                        if (that.checkHoverDiv(div, item1)) {
                            let divWidth =
                                parseFloat(div.css('left')) -
                                parseFloat(item1.css('left'))
                            if (divWidth < 0) {
                                div.width(divWidth * -1)
                            } else {
                                item1.width(divWidth)
                            }
                        }
                    }
                }
            }

            $('#setPlayLength').modal('hide')
        })
    }

    //通用方法

    //监听属性变化观察者
    observer(el, func, filter) {
        var observer = new MutationObserver(function (mutations, observer) {
            mutations.forEach(function (mutation) {
                func(mutation)
            })
        })
        var config = {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: filter
        }

        observer.observe(el, config)
    }

    //秒转化为00:00:00格式
    formatSeconds(value) {
        var theTime = parseInt(value) // 秒
        var theTime1 = 0 // 分
        var theTime2 = 0 // 小时

        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60)
            theTime = parseInt(theTime % 60)

            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60)
                theTime1 = parseInt(theTime1 % 60)
            }
        }

        theTime1 = theTime1 < 10 ? `0${theTime1}` : theTime1
        theTime2 = theTime2 < 10 ? `0${theTime2}` : theTime2
        theTime = theTime < 10 ? `0${theTime}` : theTime

        var result = `00:00:${theTime}`

        if (theTime1 > 0) {
            result = `00:${theTime1}:${theTime}`
        }

        if (theTime2 > 0) {
            result = `${theTime2}:${theTime1}:${theTime}`
        }

        return result
    }

    //时分秒转化为秒
    formatToS(val) {
        let value = String(val)
        let h = Number(value.slice(0, 2))
        let m = Number(value.slice(3, 5))
        let s = Number(value.slice(6, 8))

        return h * 60 * 60 + m * 60 + s
    }

    //判断是否在元素中
    checkHover(e, div) {
        // debugger
        div = div[0]

        let window = div.getBoundingClientRect()
        var x = e.clientX
        var y = e.clientY
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
        }
    }

    //判断两个元素是否在x轴重合
    checkHoverDiv(div1, div2) {
        // debugger
        div1 = div1[0]
        div2 = div2[0]

        let window1 = div1.getBoundingClientRect()
        let window2 = div2.getBoundingClientRect()

        let div1L = window1.left
        let div2L = window2.left

        let div1R = window1.left + window1.width
        let div2R = window2.left + window2.width

        // if (Math.max(div1L, div2L) <= Math.min(div2R, div2R)) {
        //     return true
        // } else {
        //     return false
        // }

        if (
            (div1L < div2L && div1R > div2L) ||
            (div2L < div1L && div2R > div1L) ||
            (div1L < div2L && div1R > div2R) ||
            (div1L > div2L && div1R < div2R)
        ) {
            return true
        } else {
            return false
        }
    }

    //判断元素跟目标在X轴靠左重叠还是靠右重叠
    checkHoverAround(target, div) { //target需要判断的元素 div参照系
        target = $(target)
        div = $(div)

        const rect1 = target[0].getBoundingClientRect(),
            rect2 = div[0].getBoundingClientRect()

        const div1L = rect1.left,
            div2L = rect2.left,
            div1R = rect1.right,
            div2R = rect2.right,
            middle = rect2.width / 2 + rect2.left,
            width1 = rect1.width,
            width2 = rect2.width


        let left, right

        left = (width1 + width2) - Math.abs(div1L - div2L) - Math.abs(div1R - middle)
        right = (width1 + width2) - Math.abs(div1L - middle) - Math.abs(div1R - div2R)

        if (left > right) {
            return 'left'
        } else {
            return 'right'
        }
    }

    //超出边界修正位置
    fixPosition(that, oparent) {
        let left = $(oparent).offset().left
        let top = $(oparent).offset().top
        let width = $(oparent).width()
        let height = $(oparent).height()
        if (left + width > that.width) {
            $(oparent)
                .parent()
                .css('left', that.width - width)
        }
        if (top + height > that.height) {
            $(oparent)
                .parent()
                .css('top', that.height - height)
        }
        if ($(oparent).offset().top < 0) {
            $(oparent)
                .parent()
                .css('top', 0)
        }
        if ($(oparent).offset().left < 0) {
            $(oparent)
                .parent()
                .css('left', 0)
        }
    }

    //播放预览
    play() {
        let that = this
        $('#play').on('click', () => {
            let params = that.getParams('pro')
            let data = JSON.stringify(params)

            window.sessionStorage['playParams'] = data

            window.open('../Pro/play/player.html')

            // let map = that.mapElement
            // let ele = Array.from(map.values())[0]
            // let num = ele._proxyObj.width
            // ele._proxyObj.width = 500
            // console.log(ele._proxyObj.width)
        })
    }

    //素材组 
    getGroup() {
        const THAT = this
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: THAT.api.getGroup,
            data: {
                areaId: THAT.areaId
            },
            success(res) {
                let html = ''
                for (const item of res.groupNameList) {
                    html += `<option value=${item}>${item}</option>`
                }
                $('#groupIndex').html(html)
                $('#add_imgbox_area').html(html)

                THAT.getMaterial()
            }
        })
    }

    //点击修改轨道名
    setTrackName() {
        $('.trackBox').on('click', '.trackController span', function () {
            let html = `
                <input class='form-control change-track-name' style="position: relative;
                z-index: 9999;
                top: -30px;
                height: 30px;" value=${$(this).text()}>
            `
            if ($(this).find('.change-track-name').length >= 1) return

            $(this).append(html)

            $(this).find('.change-track-name').select()
        })

        $('.trackBox').on('blur', '.change-track-name', function () {
            $(this).parent().text($(this).val())
            $(this).remove()
        })
    }
}

function initCanvas() {
    let getObj = JSON.parse(window.localStorage.getProgram)

    let canvas_node = $('#canvas')
    canvas_node.css({
        width: getObj.width,
        height: getObj.height
    })

    canvas = new Canvas(canvas_node, getObj)

    canvas.init()
}

initCanvas()