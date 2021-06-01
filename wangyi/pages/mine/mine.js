// pages/mine/mine.js
let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离
import {
  myRequest
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coveTransition: 'transform 1s linear',
    nickname: '',
    userId: '',
    avatarUrl: '',
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let usertInfo
    try {
      usertInfo = JSON.parse(wx.getStorageSync('userInfo'))
    } catch (error) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
    if (usertInfo) {
      let {
        nickname,
        userId,
        avatarUrl
      } = usertInfo
      this.setData({
        nickname,
        userId,
        avatarUrl
      })
      this.getHistoryList()
    }

  },
  async getHistoryList() {
    let uid = this.data.userId
    let data = await myRequest('/user/record', {
      uid,
      type: 1
    })
    let spliceData = data.weekData.slice(0, 10)
    let historyList = []
    spliceData.map((item, index) => {
      historyList.push(item.song)
    })
    this.setData({
      historyList
    })
  },
  jumpToLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  handleTouchStart(e) {
    startY = e.touches[0].clientY
  },
  handleTouchMove(e) {
    moveY = e.touches[0].clientY
    moveDistance = moveY = startY
    if (moveDistance <= 0) return
    if (moveDistance >= 80) moveDistance = 80
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(e) {
    this.setData({
      coverTransform: 'translateY(0)',
      coveTransition: 'transform 1s linear'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})