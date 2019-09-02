// 保存数据到data-p中
class SaveTool {

  static getTime(obj, id) {
    let checkEle = $('.checkEle')
    let checkData = JSON.parse(checkEle.attr('data-p'))
  
    obj.width = checkData.width
    obj.height = checkData.height
    obj.location_x = checkData.location_x
    obj.location_y = checkData.location_y
  
    obj.beginTime = id.find('input[name="startTime"]').val()
    obj.endTime = id.find('input[name="endTime"]').val()
  
    Object.assign(obj, JSON.parse($('.checkEle').attr('data-j') == 'undefined' ? '{}' : $('.checkEle').attr('data-j')))
  }

  static cImg() {
    let edi = $('#imgEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.transition = edi.find('select[name="animation"]').val()
    data.scalingRatio = edi
      .find('input[name="zoomInput"]')
      .val()

    let str = JSON.stringify(data)
    ele.attr('data-p', str)

    if (edi.find('input[name="setBack"]').is(':checked')) {
      $('.checkCanvas').addClass('setBackground')
    }
  }

  static cVideo() {
    let edi = $('#videoEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.video = edi
      .find('#video-video-check')
      .bootstrapSwitch('state')
    data.audio = edi
      .find('#video-audio-check')
      .bootstrapSwitch('state')
    data.volume = edi
      .find('#video-vol-slider .ui-slider-tip')
      .text()

    data.inTime = edi.find('input[name="startPlay"]').val()
    data.outTime = edi.find('input[name="endPlay"]').val()

    data.transition = edi.find('input[name="animation"]').val()
    data.scalingRatio = edi
      .find('input[name="zoomInput"]')
      .val()

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cAudio() {
    let edi = $('#audioEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.volume = edi
      .find('#audio-vol-slider .ui-slider-tip')
      .text()

    data.inTime = edi.find('input[name="startPlay"]').val()
    data.outTime = edi.find('input[name="endPlay"]').val()

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cText() {
    let edi = $('#textEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.text = edi.find('textarea').val()
    data.alignment = edi.find('select[name="alignment"]').val()
    data.multiline = edi
      .find('#text-multiline-check')
      .bootstrapSwitch('state')
    data.rolling = edi.find('select[name="rolling"]').val()
    data.font = edi.find('select[name="font"]').val()
    data.size = edi.find('select[name="size"]').val()
    data.color = edi.find('.text-color').val()
    data.backgroundcolor = edi
      .find('.back-color')
      .val()
    data.transparency = edi
      .find('#text-transparency-slider .ui-slider-tip')
      .text()
    data.bold = edi
      .find('#text-border-check')
      .bootstrapSwitch('state')
    data.italic = edi
      .find('#text-italic-check')
      .bootstrapSwitch('state')
    data.playbackspeed = edi
      .find('select[name="playbackspeed"]')
      .val()
    data.residencetime = edi
      .find('input[name="residencetime"]')
      .val()
    data.wordSpace = edi.find('input[name="wordSpace"]').val()
    data.rowSpace = edi.find('input[name="rowSpace"]').val()

    data.effectColor = edi.find('#text_font_effect_color').val()
    data.effectFont = edi.find('#font_effect').val()

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cRtsp() {
    let edi = $('#rtspEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.adress = edi.find('input[name="address"]').val()
    data.protocol = edi.find('select[name="protocol"]').val()

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cTable() {
    let edi = $('#tableEdi')
    let ele = $('.checkEle')
    let imgEle = $('.checkCanvas')
    let data = {}

    SaveTool.getTime(data, edi)
    data.height = imgEle.height()
    data.width = imgEle.width()
    data.mqAddress = edi.find('input[name="mqAddress"]').val()
    data.queueName = edi.find('input[name="queueName"]').val()
    data.styleId = edi.find('select[name="styleId"]').val()

    let rowList = []
    let dataColumnList = []
    for (const item of $('#rowDataTable tbody tr')) {
      let ele = $(item)
      rowList.push(ele.find('input[name="rowList"]').val())
      dataColumnList.push(
        ele.find('input[name="dataColumnList"]').val()
      )
    }
    data.rowList = rowList
    data.dataColumnList = dataColumnList

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cClock() {
    let edi = $('#clockEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.styleId = edi.find('select[name="styleId"]').val()
    data.font = edi.find('select[name="font"]').val()
    data.size = edi.find('select[name="size"]').val()
    data.color = edi.find('.text-color').val()
    data.backgroundcolor = edi
      .find('.back-color')
      .val()
    data.transparency = edi
      .find('#clock-transparency-slider .ui-slider-tip')
      .text()
    data.bold = edi
      .find('#clock-border-check')
      .bootstrapSwitch('state')
    data.italic = edi
      .find('#clock-italic-check')
      .bootstrapSwitch('state')
    data.alignment = edi.find('select[name="alignment"]').val()

    data.timeDiff = edi.find('#clock_time_difference').val()
    data.timeStyle = edi.find('select[name="format-style"]').val()
    data.Format = $('#clock_format_box select:not(.hidden)').find('option').eq($('#clock_format_box select:not(.hidden)').val()).text()

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cWeather() {
    let edi = $('#weatherEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.styleId = edi.find('select[name="styleId"]').val()

    data.font = edi.find('select[name="font"]').val()
    data.size = edi.find('select[name="size"]').val()
    data.color = edi.find('input[name="color"]').val()
    data.bold = edi
      .find('#clock-border-check')
      .bootstrapSwitch('state')
    data.italic = edi
      .find('#clock-italic-check')
      .bootstrapSwitch('state')
    data.alignment = edi.find('select[name="alignment"]').val()

    data.city = edi.find('input[name="city"]').val()
    data.data = edi.find('select[name="data"]').val()
    data.weather = edi
      .find('#weather-show-weather')
      .bootstrapSwitch('state')
    data.temperature = edi
      .find('#weather-show-temperature')
      .bootstrapSwitch('state')
    data.windPower = edi
      .find('#weather-show-windPower')
      .bootstrapSwitch('state')

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cHtml() {
    let edi = $('#htmlEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.overflow = edi.find('select[name="overflow"]').val()
    data.url = edi.find('input[name="url"]').val()
    data.transparency = edi
      .find('#transparent-range .ui-slider-tip')
      .text()

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cDocument() {
    let edi = $('#documentEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)
    data.transition = edi.find('input[name="transition"]').val()
    data.scalingRatio = edi
      .find('input[name="zoomInput"]')
      .val()

    data.residencetime = edi
      .find('input[name="residencetime"]')
      .val()

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }

  static cImgbox() {
    let edi = $('#imgBoxEdi')
    let ele = $('.checkEle')
    let data = {}

    SaveTool.getTime(data, edi)

    data.fileNameList = JSON.parse(ele.attr('data-p')).fileNameList

    data.transition = edi.find('input[name="transition"]').val()
    data.scalingRatio = edi
    .find('input[name="zoomInput"]')
    .val()
    data.residenceTime = parseInt(edi.find('input[name="residenceTime"]').val())

    let str = JSON.stringify(data)
    ele.attr('data-p', str)
  }
}