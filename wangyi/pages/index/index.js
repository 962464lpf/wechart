import {
  myRequest
} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    tuiJianList: [],
    paiHangList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBanner()
    this.getTuiJianList()
    this.getPaiHangList()
  },
  jumpToRecommend(){
    wx.navigateTo({
      url: '/pages/recommend/recommend',
    })
  },

  // 获取banner
  async getBanner() {
    let data = await myRequest('/banner', {
      type: 2
    })
    this.setData({
      banners: data.banners
    })
  },

  // 获取推荐歌单
  async getTuiJianList() {
    let data = await myRequest('/personalized', {
      limit: 10
    })
    this.setData({
      tuiJianList: data.result
    })
  },

  // 获取排行榜（获取5个不同榜单的数据）
  async getPaiHangList() {
    let {
      paiHangList
    } = this.data
    for (let i = 0; i < 5; i++) {
      let data = await myRequest('/top/list', {
        idx: i
      })
      let name = data.playlist.name
      let songList = data.playlist.tracks.slice(0, 5)
      let obj = {
        songList,
        name,
        id: 'paiHangid' + i
      }
      paiHangList.push(obj)
      this.setData({
        paiHangList
      })
    }
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