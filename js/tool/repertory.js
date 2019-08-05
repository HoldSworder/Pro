//监听素材仓库变化，设置相应画布元素变化
class RepertoryTool {
  constructor(THAT) {
    this.THAT = THAT
  }

  videoEdiInit() {
    $('#video-slider')
      .slider({
        min: 0,
        max: 100,
        range: true
      })
      .slider('pips', {
        rest: false
      })

    $('#video-vol-slider')
      .slider({
        min: 0,
        max: 100,
        range: false
      })
      .slider('pips', {
        rest: false
      })
      .slider('float')

    $('#video-video-check').bootstrapSwitch()
    $('#video-audio-check').bootstrapSwitch()
  }

  audioEdiInit() {
    $('#audio-slider')
      .slider({
        min: 0,
        max: 100,
        range: true
      })
      .slider('pips', {
        rest: false
      })

    $('#audio-vol-slider')
      .slider({
        min: 0,
        max: 100,
        range: false
      })
      .slider('pips', {
        rest: false
      })
      .slider('float')
  }

  textEdiInit() {
    const form = $('#textEdi form')

    $('#text-transparency-slider')
      .slider({
        min: 0,
        max: 100,
        range: false
      })
      .slider('pips', {
        rest: false
      })
      .slider('float')

    $('#text-verticalcheck')
      .parent()
      .on('switch-change', function (e, data) {
        console.log('ok')
      })

    this.setEdi(form)
  }

  tableEdiInit() {
    $('#addTableRow').on('click', function () {
      let html = `
              <tr>
                  <td>
                      <input name="dataColumnList" class="form-control">
                  </td>
                  <td>
                      <input name="rowList" class="form-control">
                  </td>
              </tr>
              `

      $('#rowDataTable tbody').append(html)
    })
  }

  htmlEdiInit() {
    $('.transparent-range')
      .slider({
        min: 0,
        max: 10,
        range: false
      })
      .slider('pips', {
        rest: false
      })
      .slider('float')
  }

  clockEdiInit() {
    const form = $('#clockEdi form'),
      THAT = this.THAT

    for (let i = 0; i < 24; i++) {
      $('#clock_time_difference').append(`<option value="${i}">${i}</option>`)
    }

    this.setEdi(form)

    form.find('select[name="format-style"]').on('change', function () {
      const name = $(this).val()
      const box = $('#clock_format_box')
      box.find('select').addClass('hidden')
      $('#clock_time_difference').addClass('hidden')
      switch (name) {
        case '日期':
          box.find('select[name="format-date"]').removeClass('hidden')
          box.find('select[name="format-date"]').change()
          break
        case '星期':
          box.find('select[name="format-week"]').removeClass('hidden')
          box.find('select[name="format-week"]').change()
          break
        case '时间':
          $('#clock_time_difference').removeClass('hidden')
          box.find('select[name="format-time"]').removeClass('hidden')
          box.find('select[name="format-time"]').change()
          break
      }
    })

    form.find('select[name="format-time"]').on('change', function () {
      const index = $(this).val(),
        element = THAT.mapElement.get($('.checkCanvas').attr('data-i')),
        dImg = element.dImg,
        date = Tool.getTime(new Date())

      let imgText
      switch (index) {
        case '0':
          imgText = `<span class="clock-text-hours">${date.hours}</span>:${date.min}:${date.sec}`
          break
        case '1':
          imgText = `<span class="clock-text-hours">${date.hours}</span>时${date.min}分`
          break
        case '2':
          imgText = `<span class="clock-text-hours">${date.hours}</span>:${date.min}`
          break
        case '3':
          imgText = `<span class="clock-text-hours">${date.hours}</span>:${date.min} ${date.hours < 12 ? 'AM':'PM'}`
          break
        case '4':
          imgText = `<span class="clock-text-hours">${date.hours}</span>:${date.min}:${date.sec} ${date.hours < 12 ? 'AM':'PM'}`
          break
        case '5':
          imgText = `<span class="clock-text-hours">${date.hours}</span>:${date.min} ${date.hours < 12 ? 'A':'P'}`
          break
        case '6':
          imgText = `<span class="clock-text-hours">${date.hours}</span>:${date.min}:${date.sec} ${date.hours < 12 ? 'A':'P'}`
          break
        case '7':
          imgText = `${date.hours < 12 ? '上午':'下午'}`
          break
        case '8':
          imgText = `${date.ms}`
          break
        case '9':
          imgText = `<span class="clock-text-hours">${date.hours}<span>`
          break
        case '10':
          imgText = `${date.min}`
          break
        case '11':
          imgText = `${date.sec}`
          break
      }
      dImg.html(imgText)
    })

    form.find('select[name="format-date"]').on('change', function () {
      const index = $(this).val(),
        element = THAT.mapElement.get($('.checkCanvas').attr('data-i')),
        dImg = element.dImg,
        n = Tool.getTime(new Date()),
        monthStr = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
        monthStrE = ["", "January ", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

      let imgText
      switch (index) {
        case '0':
          imgText = `${n.year}-${n.month}-${n.day} ${n.hours}:${n.min}:${n.sec}`
          break
        case '1':
          imgText = `${n.year}-${n.month}-${n.day}`
          break
        case '2':
          imgText = `${n.year}/${n.month}/${n.day}`
          break
        case '3':
          imgText = `${String(n.year).slice(2)}-${n.month}-${n.day}`
          break
        case '4':
          imgText = `${String(n.year).slice(2)}/${n.month}/${n.day}`
          break
        case '5':
          imgText = `${n.month}-${n.day}-${n.year}`
          break
        case '6':
          imgText = `${n.month}/${n.day}/${n.year}`
          break
        case '7':
          imgText = `${n.month}-${n.day}-${String(n.year).slice(2)}`
          break
        case '8':
          imgText = `${n.month}/${n.day}/${String(n.year).slice(2)}`
          break
        case '9':
          imgText = `${n.year}年${n.month}月${n.day}`
          break
        case '10':
          imgText = `${n.day}-${n.month}-${n.year}`
          break
        case '11':
          imgText = `${n.day}/${n.month}/${n.year}`
          break
        case '12':
          imgText = `${n.day}-${n.month}-${String(n.year).slice(2)}`
          break
        case '13':
          imgText = `${n.day}/${n.month}/${String(n.year).slice(2)}`
          break
        case '14':
          imgText = `${n.year}`
          break
        case '15':
          imgText = `${String(n.year).slice(2)}`
          break
        case '16':
          imgText = `${n.month}`
          break
        case '17':
          imgText = `${n.month}月`
          break
        case '18':
          imgText = `${new Date().getMonth() + 1}`
          break
        case '19':
          imgText = `${n.day}`
          break
        case '20':
          imgText = `${n.day}号`
          break
        case '21':
          imgText = `${new Date().getDate()}`
          break
        case '22':
          imgText = `${new Date().toDateString().slice(4, 7).toLocaleUpperCase()}`
          break
        case '23':
          imgText = `${n.month}月${n.day}日`
          break
        case '24':
          imgText = `${n.month}-${n.day}`
          break
        case '25':
          imgText = `${n.month}/${n.day}`
          break
        case '26':
          imgText = `${monthStr[n.month]}月`
          break
        case '27':
          imgText = `${monthStr[n.month]}`
          break
        case '28':
          imgText = `${monthStrE[parseInt(n.month)]}`
          break
      }
      dImg.text(imgText)
    })

    form.find('select[name="format-week"]').on('change', function () {
      const index = $(this).val(),
        element = THAT.mapElement.get($('.checkCanvas').attr('data-i')),
        dImg = element.dImg,
        n = Tool.getTime(new Date()),
        weekArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        weekStr = ["一", "二", "三", "四", "五", "六", "七"]

      let imgText
      switch (index) {
        case '0':
          imgText = `${weekArr[n.week - 1]}`
          break
        case '1':
          imgText = `${new Date().toDateString().slice(0, 3)}`
          break
        case '2':
          imgText = `周${weekStr[n.week - 1]}`
          break
        case '3':
          imgText = `${weekStr[n.week - 1]}`
          break
        case '4':
          imgText = `${n.week}`
          break
        case '5':
          imgText = `星期${weekStr[n.week - 1]}`
          break
        case '6':
          imgText = `${new Date().toDateString().slice(0, 3).toLocaleUpperCase()}`
          break
      }

      dImg.text(imgText)
    })

    $('#clock_time_difference').on('change', function () {
      const diff = $(this).val(),
        date = Tool.getTime(new Date())
      $('.clock-text-hours').each(function () {
        let hours = parseInt(date.hours) + parseInt(diff)
        if (hours > 24) hours = hours % 24
        $(this).text(hours)
      })

    })


  }

  setEdi(form) {
    //设置文字内容
    form.find('textarea').on('input', function () {
      $('.checkCanvas .canvasChild').text($(this).val())
    })

    //设置文字对齐
    form.find('select[name="alignment"]').on('change', function () {
      let data = ['left', 'center', 'right']
      $('.checkCanvas .canvasChild').css(
        'text-align',
        data[$(this).val()]
      )
    })

    //设置文字字号
    form.find('input[name="size"]').on('change', function () {
      let font = parseInt($(this).val())

      if (font < 12) {
        font = 12
        $(this).val(12)
      }

      $('.checkCanvas .canvasChild').css('font-size', font)
    })

    //设置文字字体
    form.find('select[name="font"]').on('change', function () {
      $('.checkCanvas .canvasChild').css('font-family', $(this).val())
    })

    //设置字体颜色
    form.find('input[name="color"]').on('change', function () {
      $('.checkCanvas .canvasChild').css('color', $(this).val())
    })


    //设置粗体
    form.find('[name="bold"]').bootstrapSwitch({
      onText: 'Yes',
      offText: 'No',
      onColor: 'success',
      offColor: 'info',
      setState: false,
      onSwitchChange: function (event, state) {
        if (state == true) {
          console.log('1111')
          $('.checkCanvas .canvasChild').css(
            'font-weight',
            'bold'
          )
        } else {
          console.log('22222')
          $('.checkCanvas .canvasChild').css(
            'font-weight',
            'normal'
          )
        }
      }
    })

    //设置斜体
    form.find('[name="italic"]').bootstrapSwitch({
      onText: 'Yes',
      offText: 'No',
      onColor: 'success',
      offColor: 'info',
      setState: false,
      onSwitchChange: function (event, state) {
        if (state == true) {
          $('.checkCanvas .canvasChild').css(
            'font-style',
            'italic'
          )
        } else {
          $('.checkCanvas .canvasChild').css(
            'font-style',
            'normal'
          )
        }
      }
    })

    //设置多行
    form.find('[name="multiline"]').bootstrapSwitch({
      onText: 'Yes',
      offText: 'No',
      onColor: 'success',
      offColor: 'info',
      setState: false,
      onSwitchChange: function (event, state) {
        if (state == true) {
          $('.checkCanvas .canvasChild').css(
            'white-space',
            'normal'
          )
        } else {
          $('.checkCanvas .canvasChild').css(
            'white-space',
            'nowrap'
          )
        }
      }
    })

    //设置字间距
    form.find('[name="wordSpace"]').on('change', function () {
      $('.checkCanvas .canvasChild').css(
        'letter-spacing',
        $(this).val()
      )
    })

    //设置行间距
    form.find('[name="rowSpace"]').on('change', function () {
      $('.checkCanvas .canvasChild').css('line-height', $(this).val())
    })

    const fontEffect = new FontEffect()

    //设置文字效果
    form.find('#font_effect').on('change', function () {
      let color = $('#text_font_effect_color').val() || 'red'
      let effect = fontEffect[`F${$(this).val()}`](color)
      $('.checkCanvas .canvasChild').css('textShadow', effect)
    })

    //设置文字颜色
    $('.effect-color').colorpicker({
      fillcolor: true,
      success(o, color) {
        const index = $('#font_effect').val()

        if (index == 0) return
        const effect = fontEffect[`F${index}`](color)
        $('.checkCanvas .canvasChild').css('textShadow', effect)
      }
    })
  }
}