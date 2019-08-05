class FontEffect {
  constructor() {
    this.colorArr = ['#fff']
  }

  F1(color) {
    return `${color} 1px 1px 0px, ${color} 2px 2px 0px`
  }
  F2(color) {
    return `${color} 0px 0px 6px`
  }
  F3(color) {
    return `rgb(255, 255, 255) 0px 0px 10px, rgb(255, 255, 255) 0px 0px 20px, rgb(255, 255, 255) 0px 0px 30px, ${color} 0px 0px 40px, ${color} 0px 0px 70px, ${color} 0px 0px 80px, ${color} 0px 0px 100px, ${color} 0px 0px 150px`
  }
  F4(color) {
    return `${color} 0px 2px 3px`
  }
  F5(color) {
    return `${color} 3px 3px 6px`
  }
  F6(color) {
    return `rgba(15, 0, 0, 0.5) 6px 6px 0px`
  }
  F7(color) {
    return `rgb(254, 252, 201) 0px 0px 20px, rgb(254, 236, 133) 10px -10px 30px, rgb(255, 174, 52) -20px -20px 40px, rgb(236, 118, 12) 20px -40px 50px, rgb(205, 70, 6) -20px -60px 60px, rgb(151, 55, 22) 0px -80px 70px, rgb(69, 27, 14) 10px -90px 80px`
  }
  F8(color) {
    return `currentcolor 0px 0px 1px, ${color} -1px -1px 1px, ${color} 0px -1px 1px, ${color} 1px -1px 1px, ${color} 1px 0px 1px, ${color} 1px 1px 1px, ${color} 0px 1px 1px, ${color} -1px 1px 1px, ${color} -1px 0px 1px`
  }
  F9(color) {
    return `currentcolor 0px 0px 1px, rgb(0, 0, 0) 1px 1px 1px, rgb(0, 0, 0) 2px 2px 3px`
  }
  F10(color) {
    return `currentcolor 0px 0px 1px, rgb(0, 0, 0) 1px 1px 1px, rgb(0, 0, 0) 2px 2px 3px`
  }
  F11(color) {
    return `currentcolor 0px 0px 1px, ${color} -1px -1px 1px, ${color} 0px -1px 1px, ${color} 1px -1px 1px, rgb(51, 0, 0) 1px 1px 1px, rgb(51, 0, 0) 0px 1px 1px, rgb(51, 0, 0) -1px 1px 1px, rgb(77, 0, 0) -2px -2px 1px, rgb(77, 0, 0) -1px -2px 1px, rgb(77, 0, 0) 0px -2px 1px, rgb(77, 0, 0) 1px -2px 1px, rgb(77, 0, 0) 2px -2px 1px, rgb(77, 0, 0) 2px -1px 1px, rgb(77, 0, 0) 2px 0px 1px, rgb(77, 0, 0) 2px 1px 1px, rgb(77, 0, 0) -2px 0px 1px, rgb(77, 0, 0) -2px -1px 1px, rgb(77, 0, 0) -2px 1px 1px, rgb(26, 0, 0) 2px 2px 2px, rgb(26, 0, 0) 1px 2px 2px, rgb(26, 0, 0) 0px 2px 2px, rgb(26, 0, 0) -1px 2px 2px, rgb(26, 0, 0) -2px 2px 2px`
  }
  F12(color) {
    return `currentcolor 0px 0px 1px, rgb(230, 0, 0) -1px -1px 1px, rgb(204, 0, 0) 0px -1px 1px, rgb(179, 0, 0) -1px 0px 1px, rgb(179, 0, 0) 1px -1px 1px, rgb(153, 0, 0) 1px 0px 1px, rgb(153, 0, 0) 1px 1px 1px, rgb(153, 0, 0) 0px 1px 1px, rgb(153, 0, 0) -1px 1px 1px, rgb(255, 128, 128) -2px -2px 1px, rgb(255, 51, 51) -2px -1px 1px, rgb(255, 51, 51) -2px 0px 1px, ${color} -1px -2px 1px, ${color} 0px -2px 1px, ${color} 1px -2px 1px, rgb(179, 0, 0) 2px -2px 1px, rgb(179, 0, 0) 2px -1px 1px, rgb(153, 0, 0) 2px 0px 1px, rgb(51, 0, 0) 2px 1px 1px, rgb(51, 0, 0) 2px 2px 1px, rgb(77, 0, 0) 1px 2px 1px, rgb(51, 0, 0) 0px 2px 1px, rgb(102, 0, 0) -1px 2px 1px, rgb(102, 0, 0) -2px 2px 1px, rgb(51, 0, 0) -2px 1px 1px, rgb(0, 0, 102) -3px -3px 1px, rgb(0, 0, 102) -2px -3px 1px, rgb(0, 0, 102) -1px -3px 1px, rgb(0, 0, 102) 0px -3px 1px, rgb(0, 0, 102) 1px -3px 1px, rgb(0, 0, 102) 2px -3px 1px, rgb(0, 0, 102) 3px -3px 1px, rgb(0, 0, 102) 3px -2px 1px, rgb(0, 0, 102) 3px -1px 1px, rgb(0, 0, 102) 3px 0px 1px, rgb(0, 0, 102) 3px 1px 1px, rgb(0, 0, 102) 3px 2px 1px, rgb(0, 0, 102) 3px 3px 2px, rgb(0, 0, 102) 2px 3px 1px, rgb(0, 0, 102) 1px 3px 1px, rgb(0, 0, 102) 0px 3px 1px, rgb(0, 0, 102) -1px 3px 1px, rgb(0, 0, 102) -2px 3px 1px, rgb(0, 0, 102) -3px 3px 1px, rgb(0, 0, 102) -3px 2px 1px, rgb(0, 0, 102) -3px 1px 1px, rgb(0, 0, 102) -3px 0px 1px, rgb(0, 0, 102) -3px -1px 1px, rgb(0, 0, 102) -3px -2px 1px`
  }
  F13(color) {
    return `currentcolor 0px 0px 2px, rgb(255, 153, 153) 0px -1px 1px, rgb(204, 0, 0) -1px -1px 1px, rgb(204, 0, 0) 1px -1px 1px, rgb(204, 0, 0) 1px 0px 1px, rgb(204, 0, 0) 0px -1px 1px, rgb(102, 0, 0) 0px 1px 1px, rgb(204, 0, 0) 1px 1px 1px, rgb(204, 0, 0) -1px 1px 1px, rgb(102, 0, 0) -2px -2px 1px, rgb(102, 0, 0) -1px -2px 1px, rgb(102, 0, 0) 0px -2px 1px, rgb(102, 0, 0) 1px -2px 1px, rgb(102, 0, 0) 2px -2px 1px, rgb(102, 0, 0) 2px -1px 1px, rgb(102, 0, 0) 2px 0px 1px, rgb(102, 0, 0) 2px 1px 1px, rgb(102, 0, 0) 2px 2px 1px, rgb(102, 0, 0) 1px 2px 1px, rgb(102, 0, 0) 0px 2px 3px, rgb(102, 0, 0) -1px 2px 1px, rgb(102, 0, 0) -2px 2px 1px, rgb(102, 0, 0) -2px 1px 1px, rgb(102, 0, 0) -2px 0px 1px, rgb(102, 0, 0) -2px -1px 1px`
  }
  F14(color) {
    return `currentcolor 0px 0px 1px, rgb(8, 48, 88) 2px 0px 1px, rgb(152, 192, 232) 0px 2px 1px, rgb(8, 48, 88) 2px 1px 1px, rgb(152, 192, 232) 1px 2px 1px, rgb(72, 112, 152) 2px 2px 1px, rgb(8, 48, 88) 3px 1px 1px, rgb(152, 192, 232) 1px 3px 1px, rgb(8, 48, 88) 3px 2px 1px, rgb(152, 192, 232) 2px 3px 1px, rgb(72, 112, 152) 3px 3px 1px, rgb(8, 48, 88) 4px 2px 1px, rgb(152, 192, 232) 2px 4px 1px, rgb(8, 48, 88) 4px 3px 1px, rgb(152, 192, 232) 3px 4px 1px, rgb(72, 112, 152) 4px 4px 1px, rgb(8, 48, 88) 5px 3px 1px, rgb(152, 192, 232) 3px 5px 1px, rgb(8, 48, 88) 5px 4px 1px, rgb(152, 192, 232) 4px 5px 1px, rgb(72, 112, 152) 5px 5px 1px, rgb(8, 48, 88) 6px 4px 1px, rgb(152, 192, 232) 4px 6px 1px, rgb(8, 48, 88) 6px 5px 1px, rgb(152, 192, 232) 5px 6px 1px, rgb(72, 112, 152) 6px 6px 1px, rgb(8, 48, 88) 7px 5px 1px, rgb(152, 192, 232) 5px 7px 1px, rgb(8, 48, 88) 7px 6px 1px, rgb(152, 192, 232) 6px 7px 1px, rgb(72, 112, 152) 7px 7px 1px, rgb(8, 48, 88) 8px 6px 1px, rgb(152, 192, 232) 6px 8px 1px, rgb(8, 48, 88) 8px 7px 1px, rgb(152, 192, 232) 7px 8px 1px, rgb(72, 112, 152) 8px 8px 1px, rgb(8, 48, 88) 9px 7px 1px, rgb(152, 192, 232) 7px 9px 1px, rgb(8, 48, 88) 9px 8px 1px, rgb(152, 192, 232) 8px 9px 1px, rgb(72, 112, 152) 9px 9px 1px, rgb(8, 48, 88) 10px 8px 1px, rgb(152, 192, 232) 8px 10px 1px, rgb(8, 48, 88) 10px 9px 1px, rgb(152, 192, 232) 9px 10px 1px, rgb(72, 112, 152) 10px 10px 1px, rgb(8, 48, 88) 11px 9px 1px, rgb(152, 192, 232) 9px 11px 1px, rgb(8, 48, 88) 11px 10px 1px, rgb(152, 192, 232) 10px 11px 1px, rgb(72, 112, 152) 11px 11px 1px, rgb(102, 102, 102) 11px 11px 1px, rgb(102, 102, 102) 11px 12px 1px, rgb(102, 102, 102) 10px 12px 1px, rgb(102, 102, 102) 9px 12px 1px, rgb(102, 102, 102) 8px 11px 1px, rgb(102, 102, 102) 7px 10px 1px, rgb(102, 102, 102) 6px 9px 1px, rgb(102, 102, 102) 5px 8px 1px, rgb(102, 102, 102) 4px 7px 1px, rgb(102, 102, 102) 3px 6px 1px, rgb(102, 102, 102) 2px 5px 1px, rgb(102, 102, 102) 1px 4px 1px, rgb(102, 102, 102) 0px 3px 1px, rgb(102, 102, 102) -1px 2px 1px, rgba(0, 0, 0, 0.7) 20px 8px 8px`
  }
  F15(color) {
    return `rgb(153, 153, 153) 0px 1px 0px, rgb(136, 136, 136) 0px 2px 0px, rgb(119, 119, 119) 0px 3px 0px, rgb(102, 102, 102) 0px 4px 0px, rgb(85, 85, 85) 0px 5px 0px, rgb(68, 68, 68) 0px 6px 0px, rgb(51, 51, 51) 0px 7px 0px, rgb(0, 17, 53) 0px 8px 7px`
  }
  F16(color) {
    return `rgb(153, 153, 153) 0px 1px 0px, rgb(136, 136, 136) 0px 2px 0px, rgb(119, 119, 119) 0px 3px 0px, rgb(102, 102, 102) 0px 4px 0px, rgb(85, 85, 85) 0px 5px 0px, rgb(68, 68, 68) 0px 6px 0px, rgb(51, 51, 51) 0px 7px 0px, rgb(0, 17, 53) 0px 8px 7px`
  }
  F17(color) {
    return `rgba(15, 0, 0, 0.5) 0px 5px 6px, rgba(15, 0, 0, 0.2) 1px 3px 3px`
  }

  addColor(color) {
    this.colorArr.push(color)
  }
}