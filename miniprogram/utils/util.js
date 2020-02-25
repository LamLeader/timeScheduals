var txapi_base_url = "http://api.tianapi.com/";  //天行数据接口域名
var key = "fe591b69e2ea1df2615089340beda689";  //请填写你在天行数据www.tianapi.com获得apikey

/** 新闻分类也可以通过频道列表接口动态获取
 *  头条新闻接口地址=》http://api.tianapi.com/topnews/?key=fe591b69e2ea1df2615089340beda689&num=10;
 *  看到说明：https://www.tianapi.com/apiview/65
 *  
 */

var NewsTypeList = [
  {
    NewsTypeId: 7,
    TypeName: '国内',
  },
  {
    NewsTypeId: 5,
    TypeName: '社会',
  },
  {
    NewsTypeId: 10,
    TypeName: '娱乐',
  },
  {
    NewsTypeId: 12,
    TypeName: '体育',
  },
  {
    NewsTypeId: 20,
    TypeName: 'NBA',
  },
  {
    NewsTypeId: 30,
    TypeName: 'CBA',
  },
  {
    NewsTypeId: 13,
    TypeName: '科技',
  },
  {
    NewsTypeId: 33,
    TypeName: '动漫',
  },
  {
    NewsTypeId: 21,
    TypeName: 'VR',
  },
  {
    NewsTypeId: 23,
    TypeName: '移动',
  },
  {
    NewsTypeId: 26,
    TypeName: '足球',
  },
  {
    NewsTypeId: 27,
    TypeName: '军事',
  },
  {
    NewsTypeId: 32,
    TypeName: '财经',
  },
  {
    NewsTypeId: 18,
    TypeName: '旅游',
  },
  {
    NewsTypeId: 35,
    TypeName: '汽车',
  },
  {
    NewsTypeId: 19,
    TypeName: '苹果',
  },
  {
    NewsTypeId: 31,
    TypeName: '游戏',
  },
  {
    NewsTypeId: 8,
    TypeName: '国际',
  },
  {
    NewsTypeId: 24,
    TypeName: '创业',
  }
]

// util.js
/** 
 * new Date() ---> 转化为 年 月 日 时 分 秒
 * let date = new Date();
 * date: 传入参数日期 Date
*/
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatTimeYMD(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month].map(formatNumber).join('-')
}
function formatTimeYMDay(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
//时间戳转换成日期时间
function js_date_time(unixtime) {
  var dateTime = new Date(parseInt(unixtime) * 1000)
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString()); //typescript转换写法
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  return timeSpanStr;
}

module.exports = {
  formatTime: formatTime,
  formatTimeTwo: formatTimeTwo,
  formatTimeYMD: formatTimeYMD,
  formatTimeYMDay: formatTimeYMDay,
  js_date_time: js_date_time
}
