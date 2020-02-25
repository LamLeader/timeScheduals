// pages/home/home.js
var time = require("../../utils/util.js");//导入时间工具类
const app = getApp()
Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // imgUrls: [
    //   {
    //     id: 1,
    //     link: '/pages/index/index',
    //     url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2197066702,135802552&fm=26&gp=0.jpg'
    //   }, {
    //     id: 2,
    //     link: '/pages/logs/logs',
    //     url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564145775519&di=2ebcf29f842a2a7ceb14352403bede37&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180608%2F71a9b9eb0c6346b9930cd5c893b069b6.jpeg'
    //   }, {
    //     id: 3,
    //     link: '/pages/test/test',
    //     url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564145790173&di=df08e086f8b8943d032122ad014402e8&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn20%2F700%2Fw960h540%2F20180508%2F96cb-haichqy4851613.jpg'
    //   },
    // ],
    routers: [
      {
        name: '→',
        url: '/pages/Course/course',
        icon: '/images/python_ico.png',
        code: '16'
      },
      {
        name: '收入',
        url: '/pages/accountBoot/accountBoot',
        icon: '../../images/bkgimg/income.png',
        code: '11'
      },
      {
        name: '↓',
        url: '/pages/Course/course',
        icon: '/images/python_ico.png',
        code: '16'
      },
      {
        name: '时间管理',
        url: '/pages/timeSchedual/timeSchedual',
        icon: '../../images/bkgimg/timemg.png',
        code: '13'
      },
      {
        name: '主功能页',
        url: '/pages/Course/course',
        icon: '/images/java_ico.png',
        code: '16'
      },
      {
        name: '统计图表',
        url: '/pages/report/report',
        icon: '../../images/bkgimg/report.png',
        code: '12'
      },
      {
        name: '↑',
        url: '/pages/Course/course',
        icon: '/images/python_ico.png',
        code: '16'
      },
      {
        name: '支出',
        url: '/pages/billexpenditure/billexpenditure',
        icon: '../../images/bkgimg/zhichu.png',
        code: '14'
      },
      {
        name: '←',
        icon: '/images/python_ico.png',
        code: '17'
      },
      // {
      //   name: '更多',
      //   url: '/pages/Course/course',
      //   icon: '../../images/bkgimg/more.png',
      //   code: '18'
      // }
    ],
    totalIncome:0,//总收入
    totalExpenditure:0,//账单支出
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {},
    currentDate: new Date().getTime(),
    show: false

  },
 
  //收入统计  根据月份查询
  totalIncome:function(){
    var that=this;
    const db = wx.cloud.database();
    db.collection("accountBoot").where({
      type: '1',
      queryByDate:that.data.currentDate1
    }).get({
      success: res => {
        let income=0;
        for (var index in res.data) {
          console.log("incomePrice:" + res.data[index].price);
          income += res.data[index].price;
        }
        this.setData({
          totalIncome: income,
        })
        console.log("income：" + income);
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },
  //账单支出统计 根据月份查询
  totalExpenditure: function () {
    var that = this;
    const db = wx.cloud.database();
    db.collection("accountBoot").where({
      type: '2',
      queryByDate: that.data.currentDate1
    }).get({
      success: res => {
        let expenditure = 0;
        for (var index in res.data) {
          console.log("expenditurePrice:" + res.data[index].price);
          expenditure += res.data[index].price;
        }
        this.setData({
          totalExpenditure: expenditure
        })
        console.log("expenditure:" + expenditure);
      }, fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },
  //选择时间
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
    var that = this;
    var strDate = that.data.currentDate.toString();
    var currDate = time.formatTimeTwo(strDate.substring(0, 10), 'Y-M');
    console.log("选择年月:"+currDate);//字符串截取前10位
    that.setData({
      currentDate1: currDate,
    
    });
    // 同步存储 设置缓存
    try {
      wx.setStorageSync('currentDate', that.data.currentDate1);
    } catch (e) {
       
    }

    that.totalIncome();//收入统计
    that.totalExpenditure();//账单支出统计
  },

  //加载内容
  onLoad: function () {
    var that = this
    that.getCurrentDate();
    that.totalIncome();//收入统计
    that.totalExpenditure();//账单支出统计
  },
  //页面渲染
  onReady:function(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {

  },
  //点击页面跳转
  // onProductsItmesTap: function (event) {
  //   var id = event.currentTarget.dataset.id;
  //   console.log("even:" + id);
  //   wx.navigateTo({
  //     url: 'homedetails/homedetails?id=' + id,
  //   });
  // },
  //获取当前日期
  getCurrentDate:function(){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log("当前时间：" + Y + '年' + M + '月' + D + '日');
    var that=this;
    that.setData({
      currentDate1: Y + '-' + M,
      currentDate2: Y + M
    })
   
  },
  
  //根据日期查询账单
  // searchAccout:function(){
  //   var that=this;
  //   var show1 = that.data.show;
  //   console.log("show:"+show1);
  //   if (show1==false){
  //     that.setData({
  //         show:true
  //     })
  //   }else{
  //     that.setData({
  //       show: false
  //     })
  //   }
  // }
  searchAccout: function () {
    this.setData({
      show: true
    })
  }
})
