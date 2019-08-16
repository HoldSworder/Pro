/**
 * 元素吸附相关代码
 */
class Adsorb {
  constructor(opt) {
    this.default = {
      container: document,
      attr: '.absorb', //添加class标记
      length: 10, //吸附阈值
      vertical: true, //开启垂直吸附
      horizontal: true, //开启水平吸附
      canvas: {
        container: document,
        zIndex: 1,
        lineColor: 'black',
        lineWidth: 1
      }
    }
    this.option = {
      ...this.default,
      ...opt
    }
    this.domMap = new Map()
    this.lMap = new Map() //left
    this.rMap = new Map() //right
    this.tMap = new Map() //top
    this.bMap = new Map() //bottom
    this.trans = $('#transformCanvas').val() * 0.1
    this.canvas
    this.ctx
    this.flag = 0

    this.init()
  }

  init() {
    const THAT = this
    this._bindEvent()
    if (this.option.canvas) {
      this._initCanvas()
    }

    setInterval(function () {
      THAT.flag = 0
    }, 10)
  }

  _bindEvent() { // 绑定点击事件 绑定观察者
    const {
      attr,
      container
    } = this.option
    const THAT = this

    THAT._setMap(container)

    Tool.observer(container, function (mutation) {
      THAT._setMap(container)
    })

    $('#canvas').on('click', attr, function (e) {
      const SELF = this
      if (THAT.domMap.has(this)) return

      THAT._event(this)

      $(THAT.canvas).on('mouseup', function (e) {
        if(canvas.checkHover(e, $(SELF))) {
          canvas.focusEle(SELF)
          
        }
        THAT.canvas.style.display = 'none'
      })

    })

  }

  _event(item) { //元素移动观察者
    const THAT = this

    this.domMap.set(item, item.getBoundingClientRect())

    Tool.observer(item, function (mutation) {
      const p = item.getBoundingClientRect()

      THAT._move(p, mutation.target)


      THAT._setMap(item)
    })
    // canvas.focusEle(mutation.target)
  }

  _move(p, dom) { //元素移动判断吸附逻辑
    this._clearRect()
    const THAT = this
    const {
      left,
      right,
      top,
      bottom
    } = p

    this.flag++
    if (this.flag > 100) return

    const mapArr = []
    this.ctx.beginPath()

    if (THAT.option.vertical) mapArr.push('lMap', 'rMap')
    if (THAT.option.horizontal) mapArr.push('tMap', 'bMap')

    for (const i of mapArr) {
      for (const item of THAT[i].entries()) {
        const key = item[0],
          value = item[1],
          scale = (document.querySelector('#transformCanvas').value * .1).toFixed(1)

        if (key.getAttribute('data-i') === dom.getAttribute('data-i')) continue

        let val
        switch (i) {
          case 'lMap':
            if (THAT._checkNear(value, left)) {
              // console.log('1')
              val = THAT._calcNum(key, 'left')
              $(dom).css('left', `${val}px`)
              THAT._drawLine('y', val * scale)
            } else if (THAT._checkNear(value, right)) {
              // console.log('2')
              val = THAT._calcNum(key, 'left') - $(dom).width()
              $(dom).css('left', `${val}px`)
              THAT._drawLine('y', (val + $(dom).width()) * scale)
            }
            break;
          case 'rMap':
            if (THAT._checkNear(value, left)) {
              // console.log('3')
              val = THAT._calcNum(key, 'left') + $(key).width()
              $(dom).css('left', `${val}px`)
              THAT._drawLine('y', val * scale)
            } else if (THAT._checkNear(value, right)) {
              // console.log('4')
              val = THAT._calcNum(key, 'left') + ($(key).width() - $(dom).width())
              $(dom).css('left', `${val}px`)
              THAT._drawLine('y', (val + $(dom).width()) * scale)
            }
            break;
          case 'tMap':
            if (THAT._checkNear(value, top)) {
              // console.log('5')
              val = THAT._calcNum(key, 'top')
              $(dom).css('top', `${val}px`)
              THAT._drawLine('x', val * scale)
            } else if (THAT._checkNear(value, bottom)) {
              // console.log('6')
              val = THAT._calcNum(key, 'top') - $(dom).height()
              $(dom).css('top', `${val}px`)
              THAT._drawLine('x', (val + $(dom).height()) * scale)
            }
            break;
          case 'bMap':
            if (THAT._checkNear(value, top)) {
              // console.log('7')
              val = THAT._calcNum(key, 'top') + $(key).height()
              $(dom).css('top', `${val}px`)
              THAT._drawLine('x', val * scale)
            } else if (THAT._checkNear(value, bottom)) {
              // console.log('8')
              val = THAT._calcNum(key, 'top') - ($(dom).height() - $(key).height())
              $(dom).css('top', `${val}px`)
              THAT._drawLine('x', (val + $(dom).height()) * scale)
            }
            break;
        }
      }
    }

    this.ctx.closePath()

  }

  _setMap(dom) { //设置map
    const rect = dom.getBoundingClientRect()
    this.domMap.set(dom, rect)
    this.lMap.set(dom, rect.left)
    this.rMap.set(dom, rect.right)
    this.tMap.set(dom, rect.top)
    this.bMap.set(dom, rect.bottom)
  }

  _checkNear(val1, val2) { //判断是否处于触发阈值
    val1 = parseInt(val1)
    val2 = parseInt(val2)

    const bool = Boolean(Math.abs(val1 - val2) / this.trans < this.option.length)
    return bool
  }

  _calcNum(dom, attr) { //计算值
    let res
    if (dom == this.option.container) {
      res = 0
    } else {
      res = parseInt($(dom).css(attr))
    }
    return res
  }

  _initCanvas() { //初始化画布
    const THAT = this,
      ele = THAT.option.container,
      rect = ele.getBoundingClientRect(),
      box = this.option.canvas.container
    let canvas = this.canvas = document.createElement('canvas')
    this.ctx = canvas.getContext('2d')

    canvas.width = box.clientWidth
    canvas.height = box.clientHeight
    canvas.style.position = 'fixed'
    canvas.style.left = rect.x
    canvas.style.top = rect.y
    canvas.style.display = 'none'
    canvas.style.zIndex = this.option.canvas.zIndex

    this.ctx.strokeStyle = this.option.canvas.color

    document.querySelector('body').appendChild(canvas)
  }

  _drawLine(type, coordinate) { //绘制线条
    const width = this.canvas.clientWidth,
      height = this.canvas.clientHeight


    this.canvas.style.display = 'block'

    if (type == 'x') {
      this.ctx.moveTo(0, coordinate)
      this.ctx.lineTo(width, coordinate)
    } else {
      this.ctx.moveTo(coordinate, 0)
      this.ctx.lineTo(coordinate, height)
    }

    this.ctx.stroke()
  }

  _clearRect() { //清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  deleteMap(dom) {
    this.domMap.delete(dom)
    this.lMap.delete(dom)
    this.rMap.delete(dom)
    this.tMap.delete(dom)
    this.bMap.delete(dom)
  }
}