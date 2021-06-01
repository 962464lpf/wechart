import {
  myRequest
} from '../../utils/util'
import moment from 'moment'
import pubsub from 'pubsub-js'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    currentPosition: 0,
    songsTimes: '00:00',
    currentSongTime: 0,
    drTimes: 0,
    currentTimes: '00:00',
    musicId: '523250334',
    songDeatil: '',
    songUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = this.data.musicId
    // this.setData({
    //   id: options.id
    // })
    this.getSongDetail()
    this.getSongUrl()
    // 音频已经播放当前歌曲
    // 创建一个音频控制实例，通过页面中的控制按钮进行控制
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }
    // 创建音频实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    // 监视音频播放、暂停、停止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      console.log('播放结束')
      // 播放结束应该播放下一首
      // 这里应该是获取下一首歌曲id代码
      // 更改进度条，还原时间
      this.setData({
        currentTimes: '00: 00',
        currentPosition: 0
      })
    })
    // 监听音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      
      let currentTimes = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      // 计算当前进度条的位置
      this.setData({
        currentTimes,
        currentSongTime: this.backgroundAudioManager.currentTime * 1000
      })
      this.getCurrentPosition()
    })
  },
  // 修改播放状态
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  // 计算进度条的当前位置,总进度条450rpx
  getCurrentPosition() {
    let {
      currentPosition,
      currentSongTime,
      drTimes
    } = this.data
    currentPosition = ((currentSongTime / drTimes) * 450).toFixed(2)
    this.setData({
      currentPosition
    })
  },

  // 点击播放
  playSong() {
    let {
      isPlay,
      songUrl
    } = this.data
    this.setData({
      isPlay: !isPlay
    })
    if (!isPlay) {
      this.backgroundAudioManager.src = songUrl;
      this.backgroundAudioManager.title = this.data.songDeatil.name;
    } else {
      this.backgroundAudioManager.pause();
    }
  },

  // 获取歌曲详情
  async getSongDetail() {
    let data = await myRequest('/song/detail', {
      ids: this.data.musicId
    })
    let songDeatil = data.songs[0]
    this.setData({
      songDeatil,
      drTimes: songDeatil.dt
    })
    // 格式化歌曲的总时长
    let songsTimes = moment(songDeatil.dt).format('mm:ss')
    this.setData({
      songsTimes
    })
    // 修改窗口标题
    wx.setNavigationBarTitle({
      title: songDeatil.name,
    })
  },

  // 获取歌曲音频地址
  async getSongUrl() {
    let data = await myRequest('/song/url', {
      id: this.data.musicId
    })
    let songUrl = data.data[0].url
    this.setData({
      songUrl
    })
   
  },

  // 切换歌曲
  switchSong(e){
    // 点击的是上一首还是下一首
    let type = e.currentTarget.id
    // 暂停当前播放
    this.backgroundAudioManager.stop()
    // 订阅musicId
    pubsub.subscribe('musicId', (msg, musicId) => {
      console.log(msg, musicId)
      this.setData({
        musicId
      })
      // 获取歌曲详情
      this.getSongDetail()
      // 获取歌曲播放地址
      this.getSongUrl()
      // 取消当前订阅
      pubsub.unsubscribe('musicId')
    })
    // 将当前点击的按钮类型发布出去，获取musicId
    pubsub.publish('switchType', type)
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