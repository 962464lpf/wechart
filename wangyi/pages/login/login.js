// pages/login/login.js
import {
  loginRequest
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '18192051343',  
    password: '962464lpf'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 输入框事件
  handleInput(e) {
    let type = e.currentTarget.id
    let value = e.detail.value
    console.log(value)
    this.setData({
      [type]: value
    })
  },
  // 登录
  async login() {
    let {
      phone,
      password
    } = this.data
    wx.showToast({
      title: phone,
    })
    if (!phone) {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none'
      })
      return
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    
    let res = await loginRequest('/login/cellphone', {
      phone,
      password
    })
    wx.showToast({
      title: res.code,
    })
    if (res.code === 200) {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      wx.setStorageSync('userInfo', JSON.stringify(res.profile))
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (res.code === 400) {
      wx.showToast({
        title: '手机号码错误！',
        icon: 'warn'
      })
    } else if (res.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'warn'
      })
    } else {
      wx.showToast({
        title: '验证失败',
        icon: 'warn'
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