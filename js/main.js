import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import Net from './net/net.js'
import Clown from './player/clown'
import LeftButton from './runtime/left'
import RightButton from './runtime/right'
import UpButton from './runtime/up'
import DownButton from './runtime/down'
import ShootButton from './runtime/shoot'
import CG from './runtime/cg'

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

const FLOOR_NUM   = 20
const FLOOR_HEIGHT = 20

const CLOWN_HEIGHT  = 80
const CLOWN_WIDTH = 80

let ctx = canvas.getContext('2d')
let databus = new DataBus()
let net = new Net()
net.Init()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0  

    this.restart()
  }  

  checkEnd(){
    if(databus.player.visible && databus.clowns.length <= 0)
    {
      databus.gameOver = true
      databus.winid = 100
      this.music.playWin()
    }
    else if(!databus.player.visible && databus.clowns.length == 1){
      databus.gameOver = true
      for (let i = 0; i < databus.clowns.length; ++i) {
        let a = databus.clowns[i]
        if(a.visible){
          databus.winid = a.id
          break
        }
      }
      this.music.playLose() 
    }
    else{
      let up = []
      let down = []
      if (databus.player.visible){
        if(databus.player.pos == 0){
          down.push(databus.player)
        }else{
          up.push(databus.player)
        }
      }
      databus.clowns.forEach((item) => {
        if(item.visible){
          if(item.pos == 0){
            down.push(item)
          }else{
            up.push(item)
          }
        }
      })
      
      if (up.length == 0 || down.length == 0){
        databus.gameOver = true
      }
    }
  }

  randomSort(arr) {
    // 对数组进行随机打乱,
    // return大于0则交换位置,小于等于0就不交换
    // 由于Math.random()产生的数字为0-1之间的数
    // 所以0.5-Math.random()的是否大于0是随机结果
    // 进而实现数组的随机打乱
    var array = arr.slice();
    array.sort(function () {
      return 0.5 - Math.random();
    })
    return array
  }

  // suiji
  ranClown() {
    
    this.randomSort(databus.clowns)

    let arrNum = []
    let arrNum1 = []
    for(let i = 0; i <= 9; ++i){
      arrNum.push(i)
      arrNum1.push(i)
    }
    arrNum = this.randomSort(arrNum)
    arrNum1 = this.randomSort(arrNum1)
    console.log(arrNum)

    databus.clowns.forEach((item, index) => {
      if(index < 5)
      {
        item.setPos(1)
        item.setCell(arrNum[index])
      }else{
        item.setPos(0)
        item.setCell(arrNum1[index])
      }
      
    })
    databus.player.setPos(0)
    databus.player.setCell(arrNum1[9])

    console.log(databus.clowns);
  }

  restart() {
    databus.reset()

    

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    setTimeout(function () {
      databus.pause = true
      databus.bullets = []
      databus.showchoice = true
      console.log("on pause")
    }, 15000)

    this.bg = new BackGround(ctx)    
    this.leftButton = new LeftButton(ctx)
    this.leftButton.init(230, window.innerHeight - 170)
    this.rightButton = new RightButton(ctx)
    this.rightButton.init(230 + 50, window.innerHeight - 170)
    this.shootButton = new ShootButton(ctx)
    this.shootButton.init(window.innerWidth - 100, window.innerHeight - 130)
    this.upButton = new UpButton(ctx)
    this.upButton.init(window.innerWidth - 160, window.innerHeight - 130)
    this.downButton = new DownButton(ctx)
    this.downButton.init(window.innerWidth - 160, window.innerHeight - 130)
    //this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()
    this.cg = new CG(ctx)
    
    databus.player = new Clown(ctx)
    databus.player.setId(100)
    databus.player.img.src = 'images/hero_bak.png'

    for (let i = 0; i < 9; ++i) {
      let cn = new Clown(ctx)
      cn.setId(i)
      databus.clowns[i] = cn
      cn.onStart()
    }

    this.ranClown()


    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )

    setTimeout(function () {
      console.log(databus.cgcount)
      if(databus.cgcount >= 10)
      {
        databus.cg = false
      }
      let that = this
      const EXPLO_IMG_PREFIX = 'images/text4_0000'
      that.cg.img.src = EXPLO_IMG_PREFIX + databus.cgcount + '.png'
      databus.cgcount ++
      setTimeout(function () {
        console.log(databus.cgcount)
        if (databus.cgcount >= 10) {
          databus.cg = false
        }
        let that = this
        const EXPLO_IMG_PREFIX = 'images/text4_0000'
        that.cg.img.src = EXPLO_IMG_PREFIX + databus.cgcount + '.png'
        databus.cgcount++
      }, 1000)

    }, 1000)
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.clowns.length; i < il; i++) {
        let clo = databus.clowns[i]
        if (clo.visible && ((bullet.up && clo.pos == 1) || (!bullet.up && clo.pos == 0)) && clo.isCollideWith(bullet)){
          clo.playAnimation()
          that.music.playExplosion()
          //clo.visible = false

          bullet.visible = false
          if (bullet.father == 100){
            databus.player.addScore()
          }else{
            databus.clowns[bullet.father].addScore()
          }
          
          
        }
      }

      let clo = databus.player
      if (clo.visible && ((bullet.up && clo.pos == 1) || (!bullet.up && clo.pos == 0)) && clo.isCollideWith(bullet)) {
        clo.playAnimation()
        that.music.playExplosion()
        //clo.visible = false

        bullet.visible = false
        if (bullet.father == 100) {
          databus.player.addScore()
        } else {
          databus.clowns[bullet.father].addScore()
        }
        databus.gameOver = true
        this.music.playLose()
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(databus.cg)
    {
      this.cg.drawToCanvas(ctx)
      return;
    }

    this.bg.render(ctx)
    this.leftButton.drawToCanvas(ctx)
    this.rightButton.drawToCanvas(ctx)
    this.shootButton.drawToCanvas(ctx)

    if (databus.showchoice){
      this.upButton.drawToCanvas(ctx)
      this.downButton.drawToCanvas(ctx)
    }
    
    
    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    //this.player.drawToCanvas(ctx)
    
    databus.clowns.forEach((item) => {
      item.drawToCanvas(ctx)
    })
    databus.player.drawToCanvas(ctx)
    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }   

    if (databus.pause)
    {
      ctx.fillText(
        '点击气球切换阵营',     
        window.innerWidth / 2 - 40 + 50,
        window.innerHeight / 2
      )
    }   
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    if (databus.pause)
      return;

    this.bg.update()

    if (databus.player.pos == 0){
      this.downButton.visible = false
      this.upButton.visible = true
    }else{
      this.downButton.visible = true
      this.upButton.visible = false
    }
    

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    //this.enemyGenerate()

    this.collisionDetection()

    //if (databus.frame % 20 === 0) {
    //  this.player.shoot()
    //  this.music.playShoot()
    //}
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++
    //console.log(databus.frame)
    //if (databus.frame % 30 == 0)
    //{
    //  databus.player.reverse()
    //  databus.player.moveRight();
    //}
    this.checkEnd()

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
