/**
 * proxy绑定对象相关代码
 * observe观察者相关代码
 */

class Observer {
    constructor(key, option, func, element) {
        this.$key = key
        this.$func = func
        this.$option = option
        this.$ele = element

        this._link()
    }

    update(data) {
        const THAT = this

        Tool.debounce(() => {
            THAT.$func.call(THAT, data)
        }, 10)()

    }

    _link() {
        const THAT = this
        for (const key in this.$option) {
            const element = this.$option[key]
            if (element.length == 0) return
            switch (key) {
                case 'input':
                    for (const item of element) {
                        $(item).on('change', function () {
                            if (THAT.$option.func) THAT.$option.func.call(this)
                            if ($(this).attr('type') == 'number') {
                                THAT.$ele._proxyObj[THAT.$key] = parseInt($(this).val())
                            } else {
                                THAT.$ele._proxyObj[THAT.$key] = $(this).val()
                            }
                        })
                    }
                    break;
            }
        }
    }
}

class Element {
    constructor(data, id) {
        this.$data = data ? JSON.parse(data) : {}
        this.$id = id
        this.$type = this.$data.materialType

        this.dDiv = $('#canvas').find(`div[data-i=${this.$id}]`)
        this.dImg = this.dDiv.find('.canvasChild')
        this.dCheckEle = $('.trackBox').find(`div[data-i=${this.$id}]`)
        this.dForm = $('#ediBox').children().eq(this.$type - 1)
        this.dZoom = this.dForm.find('.zoom')
        this.dScale = this.dDiv.find('img').length == 0 ? NaN : this.dImg[0].naturalWidth / this.dImg[0].naturalHeight //宽高比
        //   this.dScale = NaN

        this.constrain = [1, 2] //等比例缩放类型
        this.width = this.dImg.width()
        this.height = this.dImg.height()

        this._proxyObj
        this._observe = {
            data: this.$data,
            width: this.dImg.width(),
            height: this.dImg.height(),
            x: parseInt(this.dDiv.css('left')),
            y: parseInt(this.dDiv.css('top')),
            start: '00:00:00',
            end: '00:00:00',
            scale: Math.floor(this.dImg.width() / this.dImg[0].naturalWidth),
        }

        this.mObs = new Map()

        this._proxy()
        this._observer()
        // this._timeBlur()
        this._beforeDraw()
    }

    _observer() {
        // this._zoomObserver()
        this.zoom()
        this._divObserver()
        this._imgObserver()
        this._eleObserver()
    }

    _zoomObserver() {
        const THAT = this,
            proxyObj = THAT._proxyObj,
            img = THAT.dImg,
            form = THAT.dForm

        const scaleObs = new Observer('scale', {
            input: [THAT.dForm.find('input[name="zoomInput"]')]
        }, function (newD) {
            newD = parseInt(newD)

            THAT.dForm.find('input[name="zoomInput"]').val(newD)

            THAT.dZoom.find('.ui-slider-tip').text(parseInt(newD))

            THAT.dZoom.find('.ui-slider-handle').css('left', `${(newD / 500) * 100}%`)

            const nWidth = THAT.dImg[0].naturalWidth * newD / 100,
                nHeight = THAT.dImg[0].naturalHeight * newD / 100

            proxyObj.width = nWidth
            proxyObj.height = nHeight

        }, THAT)
        this.mObs.set('scale', scaleObs)


        for (const item of $('.scaleBox').find('.ui-slider-handle')) {
            function obs(mutation) {
                const e = mutation.target
                console.log(e)
                if (THAT.constrain.indexOf(THAT.dCheckEle.attr('data-t')) != -1) {
                    return
                }

                let textV = $(e)
                    .find('.ui-slider-tip')
                    .text()
                THAT._proxyObj.scale = textV

            }

            Tool.observer(item, obs, ['style'])
        }
    }

    _divObserver() {

        const THAT = this,
            proxyObj = THAT._proxyObj,
            div = THAT.dDiv,
            form = THAT.dForm

        Tool.observer(this.dDiv[0], mutation => {
            let cX = parseInt(mutation.target.style.left)
            let cY = parseInt(mutation.target.style.top)

            proxyObj.x = cX
            proxyObj.y = cY
        }, ['style'])

        const xObs = new Observer('x', {
            input: [form.find('input[name="location_x"]')]
        }, function (newD) {
            // console.log(newD)
            form.find('input[name="location_x"]').val(newD)
            div.css('left', newD)
        }, THAT)
        this.mObs.set('x', xObs)

        const yObs = new Observer('y', {
            input: [form.find('input[name="location_y"]')]
        }, function (newD) {
            form.find('input[name="location_y"]').val(newD)
            div.css('top', newD)
        }, THAT)
        this.mObs.set('y', yObs)
    }

    _imgObserver() {
        const THAT = this,
            proxyObj = this._proxyObj,
            img = this.dImg,
            form = this.dForm,
            scale = this.dScale

        Tool.observer(THAT.dImg[0], mutation => {
            let cWidth = parseInt(mutation.target.style.width)
            let cHeight = parseInt(mutation.target.style.height)

            proxyObj.width = cWidth
            proxyObj.height = cHeight
        }, ['style'])

        const wObs = new Observer('width', {
            input: [form.find('input[name="width"]')]
        }, function (newD) {
            newD = parseInt(newD)
            let nHeight = Math.round(newD / scale)
            console.log(scale)

            form.find('input[name="width"]').val(newD)
            form.find('input[name="height"]').val(nHeight)

            img.css('width', newD)
            img.css('height', nHeight)
        }, THAT)
        this.mObs.set('width', wObs)

        const hObs = new Observer('height', {
            input: [form.find('input[name="height"]')]
        }, function (newD) {
            newD = parseInt(newD)
            let nWidth = Math.round(newD * scale)
            console.log(scale)

            form.find('input[name="height"]').val(newD)
            form.find('input[name="width"]').val(nWidth)

            img.css('height', newD)
            img.css('width', nWidth)
        }, THAT)
        this.mObs.set('height', hObs)
    }

    _eleObserver() {
        const THAT = this,
            proxyObj = THAT._proxyObj,
            form = THAT.dForm,
            checkEle = THAT.dCheckEle

        Tool.observer(this.dCheckEle[0], mutation => {
            proxyObj.start = Tool.calcTime(THAT.dCheckEle).start
            proxyObj.end = Tool.calcTime(THAT.dCheckEle).end
        }, ['style'])

        const sObs = new Observer('start', {
            input: [THAT.dForm.find('input[name="startTime"]')],
            func() {
                beforeInput.call(this)
            }
        }, function (newD) {
            form.find('input[name="startTime"]').val(newD)
            // console.log('start')
            checkEle.attr('data-begin', newD)
            calcWidth()
        }, THAT)
        this.mObs.set('start', sObs)

        const eObs = new Observer('end', {
            input: [THAT.dForm.find('input[name="endTime"]')],
            func() {
                beforeInput.call(this)
            }
        }, function (newD) {
            // console.log('end')
            form.find('input[name="endTime"]').val(newD)
            checkEle.attr('data-end', newD)
            calcWidth()
        }, THAT)
        this.mObs.set('end', eObs)

        function beforeInput() {

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
            }
        }

        function getSeconds(data) {
            let indexA = data.split(':')

            let h = Number(indexA[0])
            let m = Number(indexA[1])
            let s = Number(indexA[2])

            let timeS = h * 60 + m * 60 + s
            return timeS
        }

        function calcWidth() {
            const sStart = getSeconds(THAT._proxyObj.start)
            const eStart = getSeconds(THAT._proxyObj.end)

            const timeA = $('#nowTime').attr('data-t') * 60
            const width = (eStart / timeA) * parseInt($('.trackContent').eq(0).width()) - parseInt(checkEle.css('left'))
            // console.log(width)

            checkEle.css('left', `${sStart / timeA * 100}%`)
            // checkEle.css('width', `${width}px`)
        }
    }

    _proxy() {
        const THAT = this
        const scale = this.dScale
        this._proxyObj = new Proxy(this._observe, {
            set: function (target, key, value, receiver) {
                if (target[key] === value) return Reflect.set(target, key, value, receiver)
                switch (key) {
                    case 'data':
                        target[key] = JSON.stringify(value)
                        break;
                    case 'width':
                        value = THAT._test(target, key, value)
                        target['height'] = Math.round(value / scale)
                        THAT.mObs.get('width').update(Math.round(value))
                        break;
                    case 'height':
                        value = THAT._test(target, key, value)
                        target['width'] = Math.round(value * scale)
                        THAT.mObs.get('height').update(Math.round(value))
                        break;
                    case 'x':
                        value = THAT._test(target, key, value)
                        THAT.mObs.get('x').update(value)
                        break;
                    case 'y':
                        value = THAT._test(target, key, value)
                        THAT.mObs.get('y').update(value)
                        break;
                    case 'scale':
                        value = THAT._test(target, key, value)
                        THAT.mObs.get('scale').update(value)
                        break;
                    case 'start':
                        THAT.mObs.get('start').update(value)
                        break;
                    case 'end':
                        THAT.mObs.get('end').update(value)
                        break;
                }

                THAT.update(key, value)

                return Reflect.set(target, key, value, receiver)
            }
        })
    }

    _test(target, key, value) { //测试数据 设置最值
        const form = this.dForm,
            img = this.dImg
        value = parseInt(value)
        if (value < 0) value = 0
        switch (key) {
            case 'width':
                if (value > $option.width) value = $option.width
                break
            case 'height':
                if (value > $option.height) value = $option.height
                break
            case 'x':
                break
            case 'y':
                break
            case 'scale':
                if (value < 1) {
                    value = 1
                } else if (value > 500) {
                    value = 500
                }

                const nW = img[0].naturalWidth
                const nH = img[0].naturalHeight
                const sW = nW * value / 100
                const sH = nH * value / 100
                if (sW > $option.width || sH > $option.height) {
                    if (($option.width - img.width()) < ($option.height - img.height())) {
                        value = Math.floor(($option.width / nW) * 100)
                    } else {
                        value = Math.floor(($option.height / nH) * 100)
                    }
                    // console.log(value)
                    form.find('.ui-slider-handle').css('left', `${value / 500 * 100}%`)
                    form.find('.ui-slider-tip').text(value)

                    $('.ui-slider-tip').hide()
                }

                break
        }
        return value
    }

    update(key, val) {
        const checkEle = this.dCheckEle

        let dataJ =
            checkEle.attr('data-p') == undefined ? {} :
            JSON.parse(checkEle.attr('data-p'))

        dataJ[key] = val

        checkEle.attr('data-p', JSON.stringify(dataJ))
    }

    _timeBlur() {


        $(
            '#ediBox input[name="startTime"], #ediBox input[name="endTime"]'
        ).on('change', function (e) {
            //时间格式验证
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

                let h = Number(thisV.slice(0, indexF))
                let m = Number(thisV.slice(indexF + 1, indexF + 3))
                let s = Number(thisV.slice(indexF + 4, indexF + 6))

                let timeS = h * 60 + m * 60 + s

                let timeA = $('#nowTime').attr('data-t')
                if ($(this).attr('name') == 'startTime') {
                    let timeSe = timeS / (timeA * 60)
                    $('.checkEle').css('left', `${timeSe * 100}%`)
                    $('.checkEle').attr('data-begin', thisV)
                } else {
                    let timeSe = timeS / (timeA * 60)
                    $('.checkEle').css(
                        'width',
                        `${timeSe * parseFloat($('.trackContent').width()) -
                              parseFloat($('.checkEle').css('left'))}px`
                    )
                    $('.checkEle').attr('data-end', thisV)
                }
            }
        })
    }

    zoom() {
        const that = this
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

                        //TODO：锁定缩放最大值
                        if (nWidth * trans >= $('#canvas').width()) {
                            return
                        } else if (nHeight * trans >= $('#canvas').height()) {
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


                    Tool.observer(el, obs, ['style'])

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

                            let tHeight = nHeight * (128 / nWidth)

                            canvasCheck.css({
                                width: 128 * trans,
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
    }

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

    _beforeDraw() {
        if (this.dImg.width() > $option.width) this.dImg.css('width', $option.width)
        if (this.dImg.height() > $option.height) this.dImg.css('height', $option.height)

    }
}