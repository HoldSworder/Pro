async function load() {
  for (const item of $option.data.params) {

    $('.trackBox').children().remove()
    const TRACK = canvas.newTrack(item.trackName)

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


      let html = `
            <div class="silderBlock" data-s=${DATA.fileName} data-l='0' data-J='${DATA}' data-i="${nameid}" data-t=${DATA.elementType}>
                ${DATA.fileName}
            </div>
        `

      TRACK.append(html)

      const elementObj = new Element(it.elementData, nameId)
      canvas.mapElement.set(nameId, elementObj)
    }
  }
}

if ($option.data) load()