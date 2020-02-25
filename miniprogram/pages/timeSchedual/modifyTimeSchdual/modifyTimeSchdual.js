//import Toast from '../../miniprogram_npm/@vant/weapp/toast/index';
//获取应用实例
var time = require("../../../utils/util.js");//导入时间工具类
const app = getApp()
var userInfo = wx.getStorageSync("userInfo");//获取用户信息
Page({

  /**
   * 页面的初始数据   time: 24 * 60 * 60 * 1000,  24小时 60分 60秒
   */
  data: {
    //time: 24 * 60 * 60 * 1000,
    timeSchedual: [],
    radio: '学习',
    beginTime:'',
    endTime:'',
    d:'',
    h:'',
    m:'',
    s:'',
    time: 24 * 60 * 60 * 1000,
    timeData: {},
    hours: '0' + 0,   // 时
    minute: '0' + 0,   // 分
    second: '0' + 0 ,   // 秒
    timeShow:true,//控制是否显示 秒表功能
    //存储计时器
    setInter: '',
  },
  
  //选择时间支出类别
  chooseRadio: function (event) {
    console.log("Radio:" + event.detail);
    this.setData({
      radio: event.detail
    });
  },
  
  // 计时器
  setInterval: function () {
    const that = this;
    var second = that.data.second;
    var minute = that.data.minute;
    var hours = that.data.hours;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function () {
        second++
        if (second >= 60) {
          second = 0  //  大于等于60秒归零
          minute++
          if (minute >= 60) {
            minute = 0  //  大于等于60分归零
            hours++
            if (hours < 10) {
              // 少于10补零
              that.setData({
                hours: '0' + hours
              })
            } else {
              that.setData({
                hours: hours
              })
            }
          }
          if (minute < 10) {
            // 少于10补零
            that.setData({
              minute: '0' + minute
            })
          } else {
            that.setData({
              minute: minute
            })
          }
        }
        if (second < 10) {
          // 少于10补零
          that.setData({
            second: '0' + second
          })
        } else {
          that.setData({
            second: second
          })
        }
      }
      , 1000);   
  },
  //清除计时器  即清除setInter
  endSetInter: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.id) {
      const db = wx.cloud.database();
      db.collection("timeSchedual").where({
        _id: options.id
      }).get({
        success: res => {
          this.setData({
            timeSchedual: res.data[0],//返回的是一个数组，取第一个
            radio: res.data[0].timesSelect
          })
        }, fail: err => {
          console.log(err)
        }
      })
    };

  },
  
  //表单提交
  comfirm: function (e) {
    const db = wx.cloud.database()//打开数据库连接
    let timeSchedual = e.detail.value;
    var timeScheduals = e.detail.value;
    var that = this;
    if (timeSchedual.id == "") {//id等于空是新增数据
      this.add(db, timeSchedual)  //新增记录
    } else {
      this.update(db, timeSchedual)  //修改记录
    }

  }, add: function (db, timeSchedual) {
    var date = new Date();
    //外部变量
    var that = this;
    var timesSelect = that.data.radio;
    var nickName = userInfo.nickName;
    var timesExpenditure =that.data.h + ":小时," + that.data.m + ":分钟," + that.data.s +":秒";
    db.collection("timeSchedual").add({
      data: {
        userName: nickName,
        timesSelect: timesSelect,
        ceateTime: time.formatTime(date),
        timesExpenditure: timesExpenditure,
        queryByDate: time.formatTimeYMD(date),
        timlTotal: that.data.s,
        queryCreateTime: time.formatTimeYMDay(date)
      }, success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        wx.navigateTo({
          url: '../../timeSchedual/timeSchedual',
        })
      }, fail: err => {
        wx.showToast({
          title: '新增失败',
        })
      }
    })

  }, update: function (db, accountBoot) {
    //外部变量
    var that = this;
    var timesSelect = that.data.radio;
    var nickName = userInfo.nickName;
    var timesExpenditure = that.data.d + ":天," + that.data.h + ":小时," + that.data.m + ":分钟," + that.data.s + ":秒"
    db.collection("timeSchedual").doc(accountBoot.id).update({
      data: {
        userName: nickName,
        timesSelect: timesSelect,
        timesExpenditure: timesExpenditure,
        queryByDate: time.formatTimeYMD(date)
      }, success: res => {
        wx.showToast({
          title: '修改记录成功',
        })
        wx.navigateTo({
          url: '../../timeSchedual/timeSchedual',
        })
      }, fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  },
 
  /**
   * 定时任务
   */
  //开始
  start() {
    var date = new Date();
    var that=this;
    that.setData({
      beginTime: time.formatTime(date)
    });
    // 调用计时器函数
    this.setInterval();
    //设置为可见
    that.setData({
      timeShow: true
    });
  },
  //暂停
  pause() {
    var that=this;
    var date = new Date();
    that.setData({
      endTime: time.formatTime(date)
    })
    var t1 = new Date(that.data.beginTime);
    var t2 = new Date(that.data.endTime);
    var t = new Date(t2 - t1 + 16 * 3600 * 1000);

    //定时清空
    //that.setIntervalEnd();
    that.setData({
      d: parseInt(t.getTime() / 1000 / 3600 / 24),
      h: t.getHours(),
      m: t.getMinutes(),
      s: t.getSeconds(),
      hours: '0' + 0,   // 时
      minute: '0' + 0,   // 分
      second: '0' + 0    // 秒
    });
    //清除计时器  即清除setInter
    that.endSetInter();

  },
  //重置
  reset() {
    var that = this;
    that.setData({
      beginTime:'',
      endTime: '',
      d: '0' + 0,
      h: '0' + 0,
      m: '0' + 0,
      s: '0' + 0,
      hours: '0' + 0,   // 时
      minute: '0' + 0,   // 分
      second: '0' + 0    // 秒
    });
    //清除计时器  即清除setInter
    that.endSetInter();
  },
  //完成
  finished() {
    
  },









})