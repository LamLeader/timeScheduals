// pages/login/login.js
const app = getApp()
import Notify from '../../miniprogram_npm/vant-weapp/notify/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backPath: '',
    theme: 'white-skin'
  },
  onLoad: function (options) {
    if (options.hasOwnProperty("back")) {
      this.setData({
        backPath: options.back
      })
    }
  },
  onShow: function () {
    getApp().setTheme(this)
  },
  onGotUserInfo(event) {
    const { backPath } = this.data
    // 确认获取到用户信息
    if (event.detail.errMsg === 'getUserInfo:ok') {
      const userInfo = event.detail.userInfo
      app.globalData.userInfo = userInfo
      wx.cloud.callFunction({
        name: 'createUser',
        data: {
          avatarUrl: userInfo.avatarUrl,
          name: '',
          nickName: userInfo.nickName,
          sex: userInfo.gender
        },
        success(res) {

        }
      })
      //设置缓存
      wx.setStorageSync("userInfo", userInfo);
      //console.log("userInfo.avatarUrl:" + userInfo.avatarUrl);
      wx.switchTab({
        url: '/pages/main/main',
      })
    } else {
      // 加入提示
      Notify({
        text: "需要获取基本信息，请再次点击登录",
        duration: 1500,
        selector: '#login-tips',
        backgroundColor: '#dc3545'
      });
    }
  }
})