import {
  host,
  mobileHost
} from './config'

function loginRequest(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    wx.request({
      url: mobileHost + url,
      data,
      success(res) {
        let token = res.data.token
        let cookies = res.cookies
        wx.setStorageSync('token', token)
        wx.setStorageSync('cookies', cookies)
        resolve(res.data)
      },
      fail(e) {
        reject(e)
      }
    })
  })
}

 function myRequest(url, data = {}, method = 'GET') {
  let cookies =  wx.getStorageSync('cookies')
  let cookie = ''
  try {
    cookie = cookies.find(item => item.indexOf('MUSIC_U') !== -1)
  } catch (error) {
    
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: mobileHost + url,
      data,
      header: {
        cookie
      },
      success(res) {
        resolve(res.data)
      },
      fail(e) {
        reject(e)
      }
    })
  })

}
module.exports = {
  myRequest,
  loginRequest
}