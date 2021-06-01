// pages/search/search.js
import {
  myRequest
} from '../../utils/util'
import pubsub from 'pubsub-js'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContent: 'searchContent',
    placeholderContent: '',
    searchList: [],
    historyList: [{
      name: 'fsfs'
    }],
    hotList: [{
      name: '冬天的秘密'
    }],
    index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchDefault()
    this.getHotSearchList()
    let data = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ]
    // 订阅播放页面发布的消息，获取是上一首还是下一首
    pubsub.subscribe('switchType', (msg, type) => {
      console.log(msg, type)
      let index = this.data.index
      if (type === 'pre') {
        index = index - 1
      } else {
        index = index + 1
      }
      if (index < 0) index = 0
      if (index > 9) index = 9
      this.setData({
        index
      })
      let musicId = data[index]
      pubsub.publish('musicId', musicId)
    })
  },
  // 获取默认的搜索关键字
  async getSearchDefault() {
    let data = await myRequest('/search/default')
    this.setData({
      searchContent: data.data.realkeyword
    })
  },
  // 搜索歌曲
  async searchSongs() {
    let keywords = this.data.searchContent
    let data = await myRequest('/search', {
      keywords,
      limit: 10
    })
    let searchList = data.result.songs
    this.setData({
      searchList
    })
  },
  // 热搜榜
  async getHotSearchList() {
    let data = await myRequest('/search/hot/detail')
    this.setData({
      hotList: data.data
    })
  },


  // 输入框变化
  handleInputChange(e) {
    this.setData({
      searchContent: e.detail.value.trim()
    })
    if (isSend) {
      return
    }
    isSend = true;
    this.searchSongs();
    // 函数节流
    setTimeout(() => {
      isSend = false;
    }, 300)
  },
  clearSearchContent() {
    this.setData({
      searchContent: ''
    })
  },
  jumpToSongDetail(e) {
    console.log(e)
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?id=' + id,
    })
  },
  deleteHistory() {},

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