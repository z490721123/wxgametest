import Animation from '../base/animation'
import Sprite from '../base/sprite'
import Bullet from './bullet'
import DataBus from '../databus'
import Music from '../runtime/music'
import Util from '../base/util'
let music = new Music()

let databus = new DataBus()

const screenWidth = Util.screenWidth
const screenHeight = Util.screenHeight
const PLAYER_IMG_SRC = 'images/hero.png'

const FLOOR_NUM = 10
const FLOOR_HEIGHT = 20

const CLOWN_HEIGHT = 213
const CLOWN_WIDTH = 128

const CELL_WIDTH = (screenWidth - 208) / FLOOR_NUM
const PLAYER_WIDTH = (screenWidth-208) / FLOOR_NUM
const PLAYER_HEIGHT = PLAYER_WIDTH * 200 / 128

export default class Clown extends Animation {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = 0
    this.y = 80
    this.cell = 0
    this.pos = 0
    this.id = 0
    this.score = 0
    this.bullets = []
    this.visible = true

    this.initExplosionAnimation()
  }

  setId(id){
    this.id = id
  }

  onStart()
  {
    let that = this
    // 触发AI
    setInterval(function () {
      if (databus.pause)
      {
        return
      }
      if (Math.random() * 10 > 5)
      {
        that.moveLeft()
      }
      else
      {
        that.moveRight()
      }
      
      if (Math.random() * 10 < 3)
      {
        that.shoot()
      }
      
    }, 1000)
  }

    /**
   * 反轉
   * 
   */
  reverse(){
    this.y = screenHeight - this.y
    this.pos = (this.pos+1)%2
  }

  setPos(pos){
    this.pos = pos
    if(pos == 0){
      this.y = screenHeight - PLAYER_HEIGHT
      this.img.src = ''
    }else{
      this.y = 0
    }
    
    if (this.id == 100){
      if (this.pos == 0){
        this.img.src = 'images/hero_bak.png'
      }
      else{
        this.img.src = 'images/hero_bak_1.png'
      }
    }
    else{
      if (this.pos == 0) {
        this.img.src = 'images/hero.png'
      }
      else {
        this.img.src = 'images/hero_1.png'
      }
    }
    console.log(this.y)
  }

  setCell(cell){
    console.log('cell: '+cell)
    this.cell = cell
    this.x = 208 + cell * CELL_WIDTH
  }

  /**
   * 玩家射击操作
   * 
   */
  shoot() {
    if(databus.gameOver)
      return
    if(!this.visible){
      return;
    }
    let bullet = databus.pool.getItemByClass('bullet', Bullet)

    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      10,
      this.id,
      this.pos == 0
    )

    music.playShoot()

    databus.bullets.push(bullet)
  }

  /**
   * 玩家移动操作
   * 
   */
  moveLeft() {
    if (databus.gameOver)
      return
    if (this.cell <= 0) {
      return;
    }

    let x = this.x + 10
    let cell = (x - 208) / CELL_WIDTH

    this.cell -= 1;
    this.x = 208 + this.cell * CELL_WIDTH
    console.log("move left , clown cell" + this.cell);
  }

  /**
 * 玩家移动操作
 * 
 */
  moveRight() {
    if (databus.gameOver)
      return
    if (this.cell >= FLOOR_NUM - 1) {
      return;
    }

    this.cell += 1;
    //console.log(screenWidth / 20 * this.cell)
    this.x = 208 + this.cell * CELL_WIDTH
    console.log("move right , clown cell" + this.cell);
  }

  addScore(){
    this.score ++
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新子弹位置
  update() {
    this.y += 6

    // 对象回收
    if (this.y > window.innerHeight + this.height)
      delete databus.clowns[this.id]
  }
}
