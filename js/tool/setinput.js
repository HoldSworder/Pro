//点击元素读取data-p并填充到数据仓库中
class SetInput {
  constructor(data, nowEdi) {
    this.data = data
    this.nowEdi = nowEdi
  }
  index1() {
    // this.nowEdi
    //   .find('select[name="transition"]')
    //   .val(this.data.transition)
    console.log(this.data.transition)
    this.nowEdi.find('select[name="animation"]').val(this.data.transition)
  }

  index2() {
    $('#video-video-check').bootstrapSwitch('state', this.data.video)
    $('#video-audio-check').bootstrapSwitch('state', this.data.audio)

    this.nowEdi
      .find('#video-vol-slider .ui-slider-handle')
      .css('left', `${this.data.volume}%`)
    this.nowEdi
      .find('#video-vol-slider .ui-slider-tip')
      .text(this.data.volume)

    this.nowEdi.find('input[name="startPlay"]').val(this.data.inTime)
    this.nowEdi.find('input[name="endPlay"]').val(this.data.outTime)

    this.nowEdi.find('input[name="startPlay"]').blur()
    this.nowEdi.find('input[name="endPlay"]').blur()
  }

  index3() {
    this.nowEdi
      .find('#audio-vol-slider .ui-slider-handle')
      .css('left', `${this.data.volume}%`)
    this.nowEdi
      .find('#audio-vol-slider .ui-slider-tip')
      .text(this.data.volume)

    this.nowEdi.find('input[name="startPlay"]').val(this.data.inTime)
    this.nowEdi.find('input[name="endPlay"]').val(this.data.outTime)

    this.nowEdi.find('input[name="startPlay"]').blur()
    this.nowEdi.find('input[name="endPlay"]').blur()
  }

  index4() {
    this.nowEdi.find('textarea').val(this.data.text)
    this.nowEdi.find('select[name="alignment"]').val(this.data.alignment)
    this.nowEdi
      .find('#text-multiline-check')
      .bootstrapSwitch('state', this.data.multiline)
    this.nowEdi.find('select[name="rolling"]').val(this.data.rolling)
    this.nowEdi.find('select[name="font"]').val(this.data.font)
    this.nowEdi.find('select[name="size"]').val(this.data.size)
    this.nowEdi.find('.text-color').val(this.data.color)
    this.nowEdi
      .find('.back-color')
      .val(this.data.backgroundcolor)
    this.nowEdi
      .find('#text-transparency-slider .ui-slider-handle')
      .css('left', `${this.data.transparency}%`)
    this.nowEdi
      .find('#text-transparency-slider .ui-slider-tip')
      .text(this.data.transparency)
    this.nowEdi
      .find('#text-border-check')
      .bootstrapSwitch('state', this.data.bold)
    this.nowEdi
      .find('#text-italic-check')
      .bootstrapSwitch('state', this.data.italic)
    this.nowEdi
      .find('select[name="playbackspeed"]')
      .val(this.data.playbackspeed)
    this.nowEdi
      .find('input[name="residencetime"]')
      .val(this.data.residencetime)
    this.nowEdi
      .find('select[name="transition"]')
      .val(this.data.transition)
    this.nowEdi.find('select[name="animation"]').val(this.data.animation)
  }

  index5() {
    this.nowEdi.find('input[name="address"]').val(this.data.adress)
    this.nowEdi.find('select[name="protocol"]').val(this.data.protocol)
  }

  index6() {
    this.nowEdi.find('input[name="mqAddress"]').val(this.data.mqAddress)
    this.nowEdi.find('input[name="queueName"]').val(this.data.queueName)
    this.nowEdi.find('input[name="styleId"]').val(this.data.styleId)

    let html = ''
    for (let i = 0; i < this.data.rowList.length; i++) {
      const row = this.data.rowList[i]
      const dataCol = this.data.dataColumnList[i]

      html += `
              <tr>
                  <td>
                      <input name="dataColumnList" class="form-control" value="${row}">
                  </td>
                  <td>
                      <input name="rowList" class="form-control" value="${dataCol}">
                  </td>
              </tr>
              `
    }

    this.nowEdi.find('#rowDataTable tbody').html(html)
  }

  index7() {
    this.nowEdi.find('select[name="styleId"]').val(this.data.styleId)
  }

  index8() {
    this.nowEdi.find('select[name="styleId"]').val(this.data.styleId)
  }

  index9() {
    this.nowEdi.find('select[name="overflow"]').val(this.data.overflow)
    this.nowEdi.find('input[name="url"]').val(this.data.url)

    this.nowEdi
      .find('#transparent-range .ui-slider-handle')
      .css('left', `${this.data.transparency}%`)
    this.nowEdi
      .find('#transparent-range .ui-slider-tip')
      .text(this.data.transparency)
  }

  index11() {
    let checked = JSON.parse($('.checkEle').attr('data-p')).fileNameList || []
    $('#imgbox-checked').text(checked.length)
  }
}