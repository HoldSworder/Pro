async function load() {
  for (const item of $option.data.params) {
    canvas.newTrack(item.trackName)
    for (const it of item.elementList) {
      const DATA = it.elementData
      const nameId = new Date().getTime().toString()
      await canvas.drawImg(
        DATA.fileName,
        nameId,
        nowX - canX - imgX / 2,
        nowY - canY - imgY / 2,
        that
      )

      const elementObj = new Element(that.attr('data-J'), nameId)
      canvas.mapElement.set(nameId, elementObj)
    }
  }
}

if ($option.data) load()