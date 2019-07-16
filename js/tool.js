class Tool {
  static observer(el, func, filter = ['style']) {
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

  static formatSeconds(value) { //秒转化为00:00:00格式
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

  static calcTime(el) { //计算起止时间
      let track = el.parent()
      let timeS = $('#nowTime').attr('data-t') * 60 //时间轴总时间换算s
      let trackW = track.width()
      let elL = parseFloat(el.attr('data-l'))
      let elR = parseFloat(el.width()) + elL //元素左右长度

      let beginT = parseInt((elL / trackW) * timeS)
      let endT = parseInt((elR / trackW) * timeS)

      return {
          start: Tool.formatSeconds(beginT),
          end: Tool.formatSeconds(endT)
      }
  }

  static getTime(date) {
      let n = date
      let result = {
          year: n.getFullYear(),
          month: n.getMonth() + 1,
          day: n.getDate(),
          week: n.getDay(),
          hours: n.getHours(),
          min: n.getMinutes(),
          sec: n.getSeconds(),
          mil: n.getMilliseconds(),
          stamp: n.getTime(),
          ms: n.getMilliseconds()
      }

      let addZero = ['month', 'day', 'hours', 'min', 'sec']
      for (const key in result) {
          if (result.hasOwnProperty(key)) {
              result[key] = String(result[key])
              const element = result[key]
              if (addZero.find(x => x == key)) {
                  if (element < 10) {
                      result[key] = `0${element}`
                  }
              }
          }
      }

      return result
  }

  static getEleFromId(id, type) {
      if (type == 'canvas') {
          return $('#canvas').find(`div[data-i=${id}]`)
      } else {
          return $('.trackBox').find(`div[data-i=${id}]`)
      }
  }

  static debounce(func, wait = 50) {
      let timeout
      return function (...args) {
          const ctx = this

          if (timeout) clearTimeout(timeout)

          let callNow = !timeout
          timeout = setTimeout(() => {
              timeout = null
          }, wait)

          if (callNow) func.apply(ctx, args)
      }
  }

  static throttle(func, wait = 50) {
      let previous = 0
      return function (...args) {
          const ctx = this
          let now = Date.now()
          if (now - previous > wait) {
              func.apply(ctx, args)
              previous = now
          }
      }
  }
}