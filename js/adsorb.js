class Adsorb {
  constructor(opt) {
    this.default = {
      container: document,
      attr: '.absorb',
      length: 100
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

    this.init()
  }

  init() {
    this.bindEvent()
  }

  bindEvent() {
    const {
      attr,
      container
    } = this.option
    const THAT = this

    THAT.setMap(container)

    $('#canvas').on('click', attr, function () {
      if (THAT.domMap.has(this)) return

      THAT.event(this)
    })
  }



  event(item) {
    const THAT = this

    this.domMap.set(item, item.getBoundingClientRect())

    Tool.observer(item, function (mutation) {
      const p = item.getBoundingClientRect()

      Tool.debounce(() => {
        THAT.move(p, mutation.target)
      }, 10)()

      THAT.setMap(item)
    })
  }

  move(p, dom) {
    const THAT = this
    const {
      left,
      right,
      top,
      bottom
    } = p

    // for (const item of THAT.lMap.entries()) {
    //   const key = item[0]
    //   const value = item[1]
    //   if (key.getAttribute('data-i') === dom.getAttribute('data-i')) continue

    //   if (THAT.checkNear(value, left)) {
    //     $(dom).css('left', `${THAT.calcNum(key, 'left')}px`)
    //   } else if (THAT.checkNear(value, right)) {
    //     $(dom).css('left', `${THAT.calcNum(key, 'left') - $(dom).width()}px`)
    //   }
    // }

    // for (const item of THAT.rMap.entries()) {
    //   const key = item[0]
    //   const value = item[1]
    //   if (key.getAttribute('data-i') === dom.getAttribute('data-i')) continue

    //   if (THAT.checkNear(value, left)) {
    //     $(dom).css('left', `${THAT.calcNum(key, 'left') + $(key).width()}px`)
    //   } else if (THAT.checkNear(value, right)) {
    //     $(dom).css('left', `${THAT.calcNum(key, 'left') + Math.abs($(dom).width() - $(key).width())}px`)
    //   }
    // }

    // for (const item of THAT.tMap.entries()) {
    //   const key = item[0]
    //   const value = item[1]
    //   if (key.getAttribute('data-i') === dom.getAttribute('data-i')) continue

    //   if (THAT.checkNear(value, top)) {
    //     $(dom).css('top', `${THAT.calcNum(key, 'top')}px`)
    //   } else if (THAT.checkNear(value, bottom)) {
    //     $(dom).css('top', `${THAT.calcNum(key, 'top') - $(dom).height()}px`)
    //   }
    // }

    // for (const item of THAT.bMap.entries()) {
    //   const key = item[0]
    //   const value = item[1]
    //   if (key.getAttribute('data-i') === dom.getAttribute('data-i')) continue

    //   if (THAT.checkNear(value, top)) {
    //     $(dom).css('top', `${THAT.calcNum(key, 'top') + $(key).height()}px`)
    //   } else if (THAT.checkNear(value, bottom)) {
    //     $(dom).css('top', `${THAT.calcNum(key, 'top') + Math.abs($(dom).height() - $(key).height())}px`)
    //   }
    // }

    const mapArr = ['lMap', 'rMap', 'tMap', 'bMap']
    for (const i of mapArr) {
      for (const item of THAT[i].entries()) {
        const key = item[0]
        const value = item[1]

        if (key.getAttribute('data-i') === dom.getAttribute('data-i')) continue

        switch (i) {
          case 'lMap':
            if (THAT.checkNear(value, left)) {
              $(dom).css('left', `${THAT.calcNum(key, 'left')}px`)
            } else if (THAT.checkNear(value, right)) {
              $(dom).css('left', `${THAT.calcNum(key, 'left') - $(dom).width()}px`)
            }
            break;
          case 'rMap':
            if (THAT.checkNear(value, left)) {
              $(dom).css('left', `${THAT.calcNum(key, 'left') + $(key).width()}px`)
            } else if (THAT.checkNear(value, right)) {
              $(dom).css('left', `${THAT.calcNum(key, 'left') + Math.abs($(dom).width() - $(key).width())}px`)
            }
            break;
          case 'tMap':
            if (THAT.checkNear(value, top)) {
              $(dom).css('top', `${THAT.calcNum(key, 'top')}px`)
            } else if (THAT.checkNear(value, bottom)) {
              $(dom).css('top', `${THAT.calcNum(key, 'top') - $(dom).height()}px`)
            }
            break;
          case 'bMap':
            if (THAT.checkNear(value, top)) {
              $(dom).css('top', `${THAT.calcNum(key, 'top') + $(key).height()}px`)
            } else if (THAT.checkNear(value, bottom)) {
              $(dom).css('top', `${THAT.calcNum(key, 'top') + Math.abs($(dom).height() - $(key).height())}px`)
            }
            break;
        }
      }
    }
  }

  setMap(dom) {
    const rect = dom.getBoundingClientRect()
    this.domMap.set(dom, rect)
    this.lMap.set(dom, rect.left)
    this.rMap.set(dom, rect.right)
    this.tMap.set(dom, rect.top)
    this.bMap.set(dom, rect.bottom)
  }

  checkNear(val1, val2) { //判断是否处于触发阈值
    val1 = parseInt(val1)
    val2 = parseInt(val2)

    const bool = Boolean(Math.abs(val1 - val2) / this.trans < this.option.length)
    return bool
  }

  calcNum(dom, attr) { //计算值 val1:当前元素
    let res
    if (dom == this.option.container) {
      res = 0
    } else {
      res = parseInt($(dom).css(attr))
    }
    return res
  }

}