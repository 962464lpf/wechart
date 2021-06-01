// pages/video/video.js
/**
 * 需要完成的东西
 * 1. 视频列表加载时使用图片代替，不建议存在多个video标签时
 * 2. 点击图片时自动更换为vide标签并自动播放
 * 3. 记录当前视频播放的时长，再次点击继续上次的播放，另外的视频继续转化为图片
 * 4. 视频区域的下拉刷新，下拉触底
 * 5. 分享
 */
import {
  myRequest
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [],
    videoList: [],
    activeIndex: '',
    isRefresher: false,
    currentPlayIndex: '',
    videoContext: null,
    historyPlayList: [],
    _index: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNavList()
  },

  jumpToSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 获取导航
  async getNavList(){
    let data =await myRequest('/video/group/list')
    let activeIndex = data.data[0].id
    this.setData({navList: data.data,activeIndex})
    this.getVideoListData()
  },

  // 点击顶部导航
  clickNav(e) {
    let activeIndex = e.currentTarget.id
    this.setData({
      activeIndex
    })
    this.getVideoListData()
  },

  // 请求导航数据
  async getVideoListData() {
      let data = await myRequest('/video/group', {
        id: this.data.activeIndex
      })
      let videoList = data.datas.map(item => item.data)
      this.setData({
        videoList
      })
      if (data.code === 301) {
        wx.showToast({
          title: '请重新登录',
        })
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
   
    this.setData({
      isRefresher: false
    })
  },

  // 下拉刷新
  handleRefresher() {
    // 请求数据
    this.getVideoListData()
  },
  // 触底
  handleToLower() {
    this.getVideoListData()
  },

  // 点击图片播放视频
  playVideo(e) {
    let id = e.currentTarget.id
    this.setData({
      currentPlayIndex: id
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(id)
    // videoContextPrev.stop();


    setTimeout(() => {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(id)
      let historyPlayList = this.data.historyPlayList
      let historyVideo = historyPlayList.find(item => item.vid === id)
      if (historyVideo) {
        videoContext.seek(historyVideo.currentTime)
      }
      videoContext.play();
    }, 500)

    // // 创建视频的实例,绑定到this中形成单例模式
    // this.videoContext = wx.createVideoContext(id)
    // // 查找历史播放记录中是否有已经播放过的视频,有的话跳转至指定视频位置
    // let {
    //   historyPlayList
    // } = this.data
    // let historyVideo = historyPlayList.find(item => item.vid === id)
    // if (historyVideo) {
    //   this.videoContext.seek(historyVideo.currentTime)
    // }
    // // 播放
    // this.videoContext.play()
  },

  videoPlay(e) {
    var _index = e.currentTarget.dataset.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(_index + "")
    videoContextPrev.stop();


    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index + "")
      videoContext.play();
    }, 500)
  },

  // 播放时间刷新
  playTimeUpdate(e) {
    let obj = {
      vid: e.currentTarget.id,
      currentTime: e.detail.currentTime
    }
    let {
      historyPlayList
    } = this.data
    let historyVideo = historyPlayList.find(item => item.vid === obj.vid)
    if (historyVideo) {
      historyVideo.currentTime = obj.currentTime
    } else {
      historyPlayList.push(obj)
    }

    this.setData({
      historyPlayList
    })
  },

  // 播放结束
  playEnded(e) {
    let {
      historyPlayList
    } = this.data
    let id = e.currentTarget.id
    let endIndex
    historyPlayList.find((item, index) => {
      if (item.vid === id) endIndex = index
    })
    historyPlayList.splice(endIndex, 1)
    this.setData({historyPlayList})
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
  onShareAppMessage: function ({
    from
  }) {
    let title = ''
    let path = ''
    let imageUrl = ''
    if (from === 'button') {
      title = '歌曲转发'
      path = '/pages/video/video'
      imageUrl = '/static/images/nvsheng.jpg'
    } else {
      title = '小程序转发'
      path = '/pages/index/index'
      imageUrl = '/static/images/nvsheng.jpg'
    }
    return {
      title,
      path,
      imageUrl
    }
  }
})