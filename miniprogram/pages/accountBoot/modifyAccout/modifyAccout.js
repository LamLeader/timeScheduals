//../accountBoot/accountBoot
//获取应用实例
var time = require("../../../utils/util.js");//导入时间工具类
const app = getApp()
var userInfo = wx.getStorageSync("userInfo");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountBoot: [],
    radio: '兼职'
  },
  //收入类别
  inputPrice:function(event) {
    console.log(event.detail);
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!reg.test(event.detail)) {
      wx.showToast({
        title: "请输入正确的金额",
        icon: 'none',
        duration: 1000
      })
      return;
    }
    this.setData({
      price: event.detail
    });
   
  },
  //选择收入类别
  chooseRadio:function(event) {
    console.log("Radio:"+event.detail);
    this.setData({
      radio: event.detail
    });
  },
  //描述
  inputDes: function (event){
    console.log("des:" + event.detail);
    this.setData({
      des: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      const db = wx.cloud.database();
      db.collection("accountBoot").where({
        _id: options.id
      }).get({
        success: res => {
          this.setData({
            accountBoot: res.data[0],//返回的是一个数组，取第一个
            radio: res.data[0].accoutType
          })
        }, fail: err => {
          console.log(err)
        }
      })
    }
  },
  comfirm: function (e) {
    const db = wx.cloud.database()//打开数据库连接
    let accountBoot = e.detail.value;
    console.log("e.detail.value:"+e.detail.value.price);
    var that = this;
   
    if (accountBoot.id == "") {//id等于空是新增数据
      this.add(db, accountBoot)  //新增记录
    } else {
      this.update(db, accountBoot)  //修改记录
    }
   
  }, add: function (db, accountBoot) {
    var date = new Date();
    //外部变量
    var that = this;
    var price = that.data.price;
    var accoutType = that.data.radio;
    var des = that.data.des;
    var nickName = userInfo.nickName;
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!reg.test(price)) {
      wx.showToast({
        title: "请输入正确的金额",
        icon: 'none',
        duration: 1000
      })
      return;
    }
     db.collection("accountBoot").add({
      data: {
        price: parseFloat(price),
        type: "1",
        userName: nickName,
        accoutType: accoutType,
        des: des,
        ceateTime: time.formatTime(date),
        queryByDate: time.formatTimeYMD(date)
      }, success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        wx.navigateTo({
          url: '../../accountBoot/accountBoot',
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
    var date = new Date();
    var price = that.data.price;
    var accoutType = that.data.radio;
    var des = that.data.des;
    var nickName = userInfo.nickName;
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!reg.test(price)) {
      wx.showToast({
        title: "请输入正确的金额",
        icon: 'none',
        duration: 1000
      })
      return;
    }
    db.collection("accountBoot").doc(accountBoot.id).update({
      data: {
        price: parseFloat(price),
        type: "1",
        userName: nickName,
        accoutType: accoutType,
        des: des,
        ceateTime: time.formatTime(date),
      }, success: res => {
        wx.showToast({
          title: '修改记录成功',
        })
        wx.navigateTo({
          url: '../../accountBoot/accountBoot',
        })
      }, fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  }












})