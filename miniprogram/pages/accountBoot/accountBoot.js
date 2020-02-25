// pages/index/index.js
var util = require('../../utils/util.js');
var httpRequestUtil = require("../../utils/network.js"); //require引入

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountBoot: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getSysCurrentDate();
    that.initSeachData();
  },
  //同步取出 获取缓存 当前的查询时间
  getSysCurrentDate:function(){
    try {
      var currentDate = wx.getStorageSync('currentDate')
      if (currentDate) {
        // Do something with return value
        console.log("accountBoot:" + currentDate);
        var that = this;
        that.setData({
          currentDate: currentDate
        })

      }

    } catch (e) {
      // Do something when catch error
      console.log(e);
    }
  },
  //查询数据
  initSeachData(){
    var that = this;
    const db = wx.cloud.database();
    db.collection("accountBoot").where({
      type: '1',
      queryByDate: that.data.currentDate
    }).get({
      success: res => {
        this.setData({
          accountBoot: res.data
        })
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },
  /**
   * 增删改查数据
   */
  goSet: function () {
    wx.navigateTo({
      url: '../../../modifyAccout/modifyAccout',
    })

  }, onDel: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database();
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          db.collection("accountBoot").doc(id).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
              })
              this.onLoad()//删除成功重新加载
            }, fail: err => {
              wx.showToast({
                title: '删除失败',
              })
            }
          })
          that.initSeachData();//更新查询数据
          console.log("删除数据的id:" + id);
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }, onUpdate: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../../modifyAccout/modifyAccout?id=' + id,
    })
  },
  //返回上级页面
  returnBack: function () {
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    wx.navigateBack({
      success: function () {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    })
  }
})