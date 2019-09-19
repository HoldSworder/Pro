async function load() {
  for (const item of $option.data.params) {

    $('.trackBox').children().remove()
    const TRACK = canvas.newTrack(item.trackName)
    const duration = $('#nowTime').attr('data-t') * 3600
    const trackWidth = TRACK.find('.trackContent').width()

    for (const it of item.elementList) {
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
        DATA
      )

      let left = (Tool.formatToS(DATA.beginTime) / duration) * trackWidth

      let html = `
            <div class="silderBlock" data-s=${DATA.fileName} data-l='0' data-J='${JSON.stringify(DATA)}' data-i="${nameId}" data-t=${DATA.elementType}
            style='left: ${left}px'>
                ${DATA.fileName}
            </div>
        `

      TRACK.find('.trackContent').append(html)


      const elementObj = new Element(JSON.stringify(it.elementData), nameId)
      canvas.mapElement.set(nameId, elementObj)

    }
  }
  suppTrack()
}

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

if ($option.data) load()