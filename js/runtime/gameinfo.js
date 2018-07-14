const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/win.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    //ctx.fillText(
    //  score,
    //  10,
    //  30
    //)
  }

  renderGameOver(ctx, score) {
    //ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    //ctx.fillText(
    //  '游戏结束',
    //  screenWidth / 2 - 40,
    //  screenHeight / 2 - 100 + 50
    //)

    //ctx.fillText(
    //  '得分: ' + score,
    //  screenWidth / 2 - 40,
    //  screenHeight / 2 - 100 + 130
    //)

    ctx.drawImage(
      atlas,
      322, 
      105,
      200,
      200
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40 + 50,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40 + 50,
      startY: screenHeight / 2 - 100 + 180,
      endX  : screenWidth / 2  + 50 + 50,
      endY  : screenHeight / 2 - 100 + 255
    }
  }
}

