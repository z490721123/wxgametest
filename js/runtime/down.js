import Sprite from '../base/sprite'
import DataBus from '../databus'

const DOWN_IMG_SRC = 'images/Balloon.png'
const DOWN_WIDTH = 50
const DOWN_HEIGHT = 50

let databus = new DataBus()

export default class DownButton extends Sprite {
  constructor() {
    super(DOWN_IMG_SRC, DOWN_WIDTH, DOWN_HEIGHT)
  }

  init(x, y) {
    this.x = x
    this.y = y

    this.visible = true
    // 初始化事件监听
    this.initEvent()
  }

  checkIsFingerOnAir(x, y) {
    const deviation = 3

    return !!(x >= this.x - deviation
      && y >= this.y - deviation
      && x <= this.x + this.width + deviation
      && y <= this.y + this.height + deviation)
  }

  /**
   * 玩家响应手指事件
   * 改变战机的位置
   */
  initEvent() {

    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()
      if(!this.visible)
      {
        return
      }
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      //
      if (this.checkIsFingerOnAir(x, y)) {
        // 触发事件
        console.log('down')
        setTimeout(function () {
          databus.pause = true
          databus.bullets = []
          databus.showchoice = true
          console.log("on pause")
        }, 15000)
        databus.player.setPos(0)
        databus.pause = false
        databus.showchoice = false
      }

    }).bind(this))

  }

}
