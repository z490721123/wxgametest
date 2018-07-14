let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src = 'audio/战斗音乐.wav'

    this.shootAudio     = new Audio()
    this.shootAudio.src = 'audio/飞刀.wav'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/被击杀.wav'

    this.winAudio = new Audio()
    this.winAudio.src = 'audio/胜利坏笑.wav'

    this.loseAudio = new Audio()
    this.loseAudio.src = 'audio/失败哭.wav'

    this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }

  playWin(){
    this.winAudio.currentTime = 0
    this.winAudio.play()
  }

  playLose() {
    this.loseAudio.currentTime = 0
    this.loseAudio.play()
  }
}
