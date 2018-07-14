
let instance

/**
 * 网络接口
 */
export default class Net {
  constructor() {
    if (instance)
      return instance

    instance = this
  }

  Init() {
    this.socket = wx.connectSocket({
      url: 'ws://118.25.40.163:8088',
      method: 'GET',
      success: function () {
        isConnect: true
        console.log("连接成功...")
      },
      fail: function () {
        isConnect: false
        console.log("连接失败...")
      }
    });

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    });

    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })

  }


}
