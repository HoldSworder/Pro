//点击元素读取data-p并填充到数据仓库中
class SetInput {
  constructor(data) {
    this.data = data
  }
  index1() {
    nowEdi
      .find('select[name="transition"]')
      .val(this.data.transition)
    nowEdi.find('select[name="animation"]').val(this.data.animation)
  }

  index2() {
    $('#video-video-check').bootstrapSwitch('state', this.data.video)
    $('#video-audio-check').bootstrapSwitch('state', this.data.audio)

    nowEdi
      .find('#video-vol-slider .ui-slider-handle')
      .css('left', `${this.data.volume}%`)
    nowEdi
      .find('#video-vol-slider .ui-slider-tip')
      .text(this.data.volume)

    nowEdi.find('input[name="startPlay"]').val(this.data.inTime)
    nowEdi.find('input[name="endPlay"]').val(this.data.outTime)

    nowEdi.find('input[name="startPlay"]').blur()
    nowEdi.find('input[name="endPlay"]').blur()
  }

  index3() {
    nowEdi
      .find('#audio-vol-slider .ui-slider-handle')
      .css('left', `${this.data.volume}%`)
    nowEdi
      .find('#audio-vol-slider .ui-slider-tip')
      .text(this.data.volume)

    nowEdi.find('input[name="startPlay"]').val(this.data.inTime)
    nowEdi.find('input[name="endPlay"]').val(this.data.outTime)

    nowEdi.find('input[name="startPlay"]').blur()
    nowEdi.find('input[name="endPlay"]').blur()
  }

  index4() {
    nowEdi.find('textarea').val(this.data.text)
    nowEdi.find('select[name="alignment"]').val(this.data.alignment)
    nowEdi
      .find('#text-multiline-check')
      .bootstrapSwitch('state', this.data.multiline)
    nowEdi.find('select[name="rolling"]').val(this.data.rolling)
    nowEdi.find('select[name="font"]').val(this.data.font)
    nowEdi.find('select[name="size"]').val(this.data.size)
    nowEdi.find('.text-color').val(this.data.color)
    nowEdi
      .find('.back-color')
      .val(this.data.backgroundcolor)
    nowEdi
      .find('#text-transparency-slider .ui-slider-handle')
      .css('left', `${this.data.transparency}%`)
    nowEdi
      .find('#text-transparency-slider .ui-slider-tip')
      .text(this.data.transparency)
    nowEdi
      .find('#text-border-check')
      .bootstrapSwitch('state', this.data.bold)
    nowEdi
      .find('#text-italic-check')
      .bootstrapSwitch('state', this.data.italic)
    nowEdi
      .find('select[name="playbackspeed"]')
      .val(this.data.playbackspeed)
    nowEdi
      .find('input[name="residencetime"]')
      .val(this.data.residencetime)
    nowEdi
      .find('select[name="transition"]')
      .val(this.data.transition)
    nowEdi.find('select[name="animation"]').val(this.data.animation)
  }

  index5() {
    nowEdi.find('input[name="address"]').val(this.data.adress)
    nowEdi.find('select[name="protocol"]').val(this.data.protocol)
  }

  index6() {
    nowEdi.find('input[name="mqAddress"]').val(this.data.mqAddress)
    nowEdi.find('input[name="queueName"]').val(this.data.queueName)
    nowEdi.find('input[name="styleId"]').val(this.data.styleId)

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

    nowEdi.find('#rowDataTable tbody').html(html)
  }

  index7() {
    nowEdi.find('select[name="styleId"]').val(this.data.styleId)
  }

  index8() {
    nowEdi.find('select[name="styleId"]').val(this.data.styleId)
  }

  index9() {
    nowEdi.find('select[name="overflow"]').val(this.data.overflow)
    nowEdi.find('input[name="url"]').val(this.data.url)

    nowEdi
      .find('#transparent-range .ui-slider-handle')
      .css('left', `${this.data.transparency}%`)
    nowEdi
      .find('#transparent-range .ui-slider-tip')
      .text(this.data.transparency)
  }
}