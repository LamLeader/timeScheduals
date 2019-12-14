// pages/index/index.js
var util = require('../../utils/util.js');
var httpRequestUtil = require("../../utils/network.js"); //require引入
var time = require("../../utils/util.js");//导入时间工具类
var currentDate = wx.getStorageSync("currentDate");//获取缓存 当前的查询时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeSchedual: [],
    activeNames: ['1'],
    scrollHeight: 0,      //页面高度
    currentID: 7,         //新闻类型
    TianAPInewsList: [],  //默认数据列表
    scrollTop: 0,         //Y轴滚动条位置
    touchXStart: 0,       //X轴开始位置
    touchYStart: 0,       //Y轴开始位置
    currentPage: 1,        //默认页数
    newsVlues: "",
    data: {
      time: 30 * 60 * 60 * 1000
    }

  },
  //初始化数据
  initNewsData: function () {
    this.setData({
      scrollTop: 0,
      TianAPInewsList: [],
      currentPage: 1,
      scrollHeight: 0
    });
  },
  //获取最新数据
  refreshNewList: function (e) {
    this.initNewsData();
    //this.loadNewslList(this.data.currentID);
  },
  //加载更多新闻数据
  loadMoreNews: function (e) {
    this.setData({ currentPage: this.data.currentPage + 1 });
    //this.loadNewslList(this.data.currentID);
  },
  //设置当前Y轴滚动条位置
  setCurrentYScroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },

  //X,Y开始位置
  handerTouchStart: function (e) {
    let temp = [];
    this.setData({ touchXStart: e.changedTouches[0].clientX, touchYStart: e.changedTouches[0].clientY });
  },
  //点击列表跳转
  handerNavigator: function (e) {
    var url = e.currentTarget.dataset.url    // 新闻url 
    wx.navigateTo({
      url: '/pages/view/view?url=' + url
    });
  },
  //获取用户信息
  getUserInfo(event) {
    var that = this;
    console.log(event.detail);
    console.log("avatarUrl:" + event.detail.userInfo.avatarUrl);

    that.setData({
      avatarUrl: event.detail.userInfo.avatarUrl,
    });
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
  getSysCurrentDate: function () {
    try {
      var currentDate = wx.getStorageSync('currentDate')
      console.log("缓存查询时间=>timeSchdual:" + currentDate);
      if (currentDate) {
        // Do something with return value
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
  //查询数据 根据月份查询
  initSeachData() {
    var that = this;
    const db = wx.cloud.database();
    db.collection("timeSchedual").where({
      queryByDate: that.data.currentDate
    }).get({
      success: res => {
        this.setData({
          timeSchedual: res.data
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
      url: '../../../modifyTimeSchdual/modifyTimeSchdual',
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
          db.collection("timeSchedual").doc(id).remove({
            success: res => {
              wx.showToast({
                title: '删除成功',
              })
              this.onLoad();//删除成功重新加载
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
      url: '../../../modifyTimeSchdual/modifyTimeSchdual?id=' + id,
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
  },
})