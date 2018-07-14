import Sprite from '../base/sprite'
import DataBus from '../databus'

const SHOOT_IMG_SRC = 'images/Knife.png'
const SHOOT_WIDTH = 50
const SHOOT_HEIGHT = 50

let databus = new DataBus()

export default class ShootButton extends Sprite {
  constructor() {
    super(SHOOT_IMG_SRC, SHOOT_WIDTH, SHOOT_HEIGHT)
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

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      //
      if (this.checkIsFingerOnAir(x, y)) {
        databus.player.shoot()
      }

    }).bind(this))

  }

}
