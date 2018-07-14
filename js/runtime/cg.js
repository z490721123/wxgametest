import Animation from '../base/animation'
import DataBus from '../databus'

const ENEMY_IMG_SRC = './images/text4_00000.png'
const ENEMY_WIDTH = window.innerWidth
const ENEMY_HEIGHT = window.innerHeight

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class CG extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initExplosionAnimation()
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/text4_0000'
    const EXPLO_FRAME_COUNT = 100

    //for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
    //  frames.push(EXPLO_IMG_PREFIX + (i % 10) + '.png')
    //}

    //this.initFrames(frames)
  }

  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    //if (this.y > window.innerHeight + this.height)
    //  databus.removeEnemey(this)
  }
}
