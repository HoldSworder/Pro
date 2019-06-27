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

    this.observer(item, function (mutation) {
      const p = item.getBoundingClientRect()

      THAT.move(p, mutation.target)

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
    
    for (const item of THAT.lMap.entries()) {
      const key = item[0]
      const value = item[1]
      if (key.getAttribute('data-i') === dom.getAttribute('data-i')) return

      if (THAT.checkNear(value, left)) {
        // console.log('left')
        $(dom).css('left', THAT.calcNum(left, value, key, 'left', 'left'))
      } else if (THAT.checkNear(value, right)) {
        // console.log('right')
        $(dom).css('left', THAT.calcNum(left, value, key, 'left', 'right'))
      }
    }

    for (const item of THAT.rMap.entries()) {
      const key = item[0]
      const value = item[1]
      if (key.getAttribute('data-i') === dom.getAttribute('data-i')) return

      if (THAT.checkNear(value, left)) {
        // console.log('left')
        $(dom).css('left', THAT.calcNum(left, value, key, 'left', 'left'))
      } else if (THAT.checkNear(value, right)) {
        // console.log('right')
        $(dom).css('left', THAT.calcNum(left, value, key, 'left', 'right'))
      }
    }
  }

  observer(el, func, filter = ['style']) {
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

  setMap(dom) {
    const rect = dom.getBoundingClientRect()
    this.domMap.set(dom, rect)
    this.lMap.set(dom, rect.left)
    this.rMap.set(dom, rect.right)
    this.tMap.set(dom, rect.top)
    this.bMap.set(dom, rect.bottom)
  }

  checkNear(val1, val2) {
    val1 = parseInt(val1)
    val2 = parseInt(val2)
    // console.log(val1)
    // console.log(val2)

    const bool = Boolean(Math.abs(val1 - val2) / this.trans < this.option.length)
    return bool
  }

  calcNum(val1, val2, dom, attr, attr1) { //val1:当前元素
    const c = dom.getBoundingClientRect()
    let res
    if (dom == this.option.container) {
      res = 0
    } else {
      res = parseInt($(dom).css(attr1))
    }
    return `${res}px`
  }

}