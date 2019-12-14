
var webUrl = "http://192.168.101.7:9091/";
//var webUrl = "https://easy-mock.com/mock/5d395f2d3d57c257338a2b37/";
//网络请求方法
function httpRequestUtil(model) {
  wx.request({
    url: webUrl + model.url,
    data: model.param,
    header: { //根据get或者post来判断使用哪个
      'content-type': model.method === 'POST'?'application/x-www-form-urlencoded':'application/json'
    },
    method: model.method,
    success: function (res) {
      model.success(res.data)
    },
    fail: function (res) {
      wx.showModal({
        title: "数据请求失败...",
        showCancel: false
      })
    }
  })
}
// 导出模块
module.exports = { 
  httpRequestUtil: httpRequestUtil,
  webUrl: webUrl,
}
