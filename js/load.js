async function load() {
  $('.trackBox').children().remove()
  for (const item of $option.data.params) {

    const TRACK = canvas.newTrack(item.trackName)
    const duration = $('#nowTime').attr('data-t') * 60
    const trackWidth = TRACK.find('.trackContent').width()

    console.log(item)
    for (let i = 0; i < item.elementList.length; i++) {
      const it = item.elementList[i];


      // for (const it of item.elementList) {
      const DATA = {
        ...it.elementData,
        ...it
      }
      const nameId = new Date().getTime().toString()
      await canvas.drawImg(
        DATA.fileName,
        nameId,
        DATA.location_x,
        DATA.location_y,
        DATA,
        DATA.width,
        DATA.height
      )

      const width = ((Tool.formatToS(DATA.endTime) - Tool.formatToS(DATA.beginTime)) / duration * 100).toFixed(2)
      const left = (Tool.formatToS(DATA.beginTime) / duration * 100).toFixed(2)

      const html = `
      <div class="silderBlock" data-s=${DATA.fileName} data-l='0' data-J='${JSON.stringify(DATA)}' data-p='${JSON.stringify(DATA)}' data-i="${nameId}" data-t=${DATA.elementType}
            style='left: ${left}%; width: ${width}%'>
            ${DATA.fileName}
            </div>
            `

      TRACK.find('.trackContent').append(html)

      const elementObj = new Element(JSON.stringify(it.elementData), nameId)
      canvas.mapElement.set(nameId, elementObj)

      if (i !== 0) {elementObj.dDiv.addClass('hidden')}
    }
  }
  suppTrack()
}

//补足不到4条轨道
function suppTrack() {
  let length = $('.trackBox').find('.clearfix').length
  if (length < 4) {
    let html = `
      <div class="trackSeize clearfix">
        <div class="trackController col-sm-2">
            <span></span>

        </div>
        <div id="track0" class="trackContent col-sm-10"></div>
      </div>`

    for (let index = 0; index < 4 - length; index++) {
      $('.trackBox').append(html)
    }
  }
}

function saveParams(data) {
  $('#saveForm').find('input[name="programName"]').val(data.data.programName)
  $('#saveForm').find('input[name="note"]').val(data.data.note)
  $('#saveForm').find('input[name="code"]').val(data.data.programCode).attr('readonly', true)
}

if ($option.data) load()