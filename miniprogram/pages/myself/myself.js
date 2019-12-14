//index.js
//获取应用实例
const app = getApp()
var userInfo = wx.getStorageSync("userInfo");//获取缓存
var httpRequestUtil = require("../../utils/network.js"); //require引入
Page({
  data: {
    headImg:''
  },
  //页面加载
  onLoad:function(){
    var that=this;
    var headImg = userInfo.avatarUrl;
    console.log("headImg:"+headImg);
     that.setData({
       headImg: headImg
     })
  },

  //退出登录
  loginOut: function (evet) {
    wx.showLoading({ title: '数据请求中...', icon: 'loading', duration: 10000 });//显示请求框
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync("userInfo");//退出清楚缓存
          wx.redirectTo({
            url: '../login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  //我的收藏
  myCollection: function () {
    console.log("++++++++++++======myCollection=====+++++++++++++");
    wx.navigateTo({
      url: '../../../../myCollection/myCollection',
    })
  },
  //我的评论
  myComment: function () {
    wx.navigateTo({
      url: '../../../../leavecomment/commentsList/commentsList',
    })
  }







})
