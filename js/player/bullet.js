import Sprite   from '../base/sprite'
import DataBus  from '../databus'

const BULLET_IMG_SRC = 'images/bullet.png'
const BULLET_WIDTH   = 16
const BULLET_HEIGHT  = 30

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

export default class Bullet extends Sprite {
  constructor() {
    super(BULLET_IMG_SRC, BULLET_WIDTH, BULLET_HEIGHT)
  }

  init(x, y, speed, father, up) {
    this.x = x
    this.y = y

    this[__.speed] = speed

    this.father = father

    this.up = up

    this.visible = true
  }

  // 每一帧更新子弹位置
  update() {
    if(this.up){
      this.y -= this[__.speed]
      if (this.y < -this.height)
        databus.removeBullets(this)
    }else{
      this.y += this[__.speed]
      if (this.y > window.innerHeight - this.height)
        databus.removeBullets(this)
    }
    

    // 超出屏幕外回收自身
    
    
  }
}
