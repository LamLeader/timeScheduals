// pages/report/report.js
var wxCharts = require('../../utils/wxcharts.js');
var httpRequestUtil = require("../../utils/network.js"); //require引入
var app = getApp();
var pieChart = null;
var columnChart = null;
var time = require("../../utils/util.js");//导入时间工具类
var currentDate = wx.getStorageSync("currentDate");//获取缓存 当前的查询时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chartTitle: '',
    isMainChartDisplay: true,
    name:[],
    score:[],
    indexId:0,
    series: [],
    loading: true,
   
  },
  // loading加载提示
  showLoading :function(){
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask: true,
        success(res) {
          //console.log('显示loading')
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },

// 关闭loading
hideLoading:function () {
    return new Promise((resolve) => {
      wx.hideLoading()
      //console.log('隐藏loading')
      resolve()
    })
  },
  //点击
  // touchHandler: function (e) {
  //   console.log(pieChart.getCurrentDataIndex(e));
  // },        
  /**
   * 生命周期函数--监听页面加载(页面加载完成 且只加载一次)
   */
  onLoad: function (options) {
    var that=this;
    that.getSysCurrentDate();//取出系统当前
    //that.totalIncome();//调用收入统计方法
    //that.totalExpenditure();//调用支出统计方法
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
  /**
   * 生命周期函数--监听页面初次渲染完成 渲染数据 可不等页面加载完 且能加载多次
   */
  onReady: function (e) {
     
    },

  //收入报表
  btIncome:function(){
    var that=this;
    
      try {
        var currentDate = wx.getStorageSync('currentDate')
        console.log("缓存查询时间=>btIncome:" + currentDate);
        if (currentDate) {
          that.totalIncome();//调用收入统计方法

          //that.init_pieCharts();//初始化饼图图表
        }

      } catch (e) {
        // Do something when catch error
        console.log(e);
      }

  },
  //支出报表
  btnExpenditure:function(){
    var that = this;
    try {
      var currentDate = wx.getStorageSync('currentDate')
      console.log("缓存查询时间=>btnExpenditure:" + currentDate);
      if (currentDate) {
        that.totalExpenditure();//调用支出统计方法

        //that.init_pieCharts();//初始化饼图图表 
      }

    } catch (e) {
      // Do something when catch error
      console.log(e);
    }

  },
  //时间管理
  btnTimeSchedual:function(){
    var that = this;
    try {
      var currentDate = wx.getStorageSync('currentDate')
      console.log("缓存查询时间=>btnTimeSchedual:" + currentDate);
      if (currentDate) {
        that.totalTimeSchedual();//调用支出统计方法

        //that.init_pieCharts();//初始化饼图图表 
      }

    } catch (e) {
      // Do something when catch error
      console.log(e);
    }

  },
  //收入统计
  totalIncome: function (callback) {
    var that = this;
    var arrData = [];
    const db = wx.cloud.database();
    db.collection("accountBoot").where({
      type: '1',
      queryByDate: that.data.currentDate
    }).get({
      success: res => {
        let data1 = 0;
        var name1="";
        for (var index in res.data) {
          data1=res.data[index].price;
          name1 = res.data[index].accoutType;
          arrData.push({ data: data1, name: name1});
          that.setData({
              series: arrData,
              chartTitle:'收入账单数据查看'
            });
        }
        that.init_pieCharts();//初始化饼图图表
        for (var index in that.data.series) {
          console.log("price:" + that.data.series[index].data);
        }
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },
  //账单支出统计
  totalExpenditure: function () {
    var that = this;
    var arrData = [];
    const db = wx.cloud.database();
    db.collection("accountBoot").where({
      type: '2',
      queryByDate: that.data.currentDate
    }).get({
      success: res => {
        let data1 = 0;
        var name1 = "";
        for (var index in res.data) {
          data1 = res.data[index].price;
          name1 = res.data[index].accoutType;
          //push数据到数组中
          arrData.push({
            data: data1, 
            name: name1, 
            /*format: function (val) {
              return val.toFixed(2) + '万';
            }*/
             });
          that.setData({
            series: arrData,
            chartTitle: '支出账单数据查看'
          });
          //console.log(arrData);
        }
        that.init_pieCharts();
        for (var index in that.data.series) {
          console.log("totalExpenditureprice:" + that.data.series[index].data);
        }
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },
  //时间支出统计
  totalTimeSchedual: function () {
    var that = this;
    var arrData = [];
    const db = wx.cloud.database();
    db.collection("timeSchedual").where({
      queryByDate: that.data.currentDate
    }).get({
      success: res => {
        let data1 = 0;
        var name1 = "";
        for (var index in res.data) {
          data1 = res.data[index].timlTotal;
          name1 = res.data[index].timesSelect;
          //push数据到数组中
          arrData.push({
            data: data1,
            name: name1,
            /*format: function (val) {
              return val.toFixed(2) + '万';
            }*/
          });
          that.setData({
            series: arrData,
            chartTitle: '时间管理数据查看'
          });
        }
        that.init_pieCharts();//初始化饼图图表 
        for (var index in that.data.series) {
          console.log("totalTimeSchedual:" + that.data.series[index].data);
        }
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },
  //初始化图表--饼图
  init_pieCharts: function () {
    /*------------饼图------------*/
    var that=this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
     //追加数组
    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: that.data.series,
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });
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