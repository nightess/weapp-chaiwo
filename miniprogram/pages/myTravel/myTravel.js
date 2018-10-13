//index.js
const app = getApp()
const util = require('../../utils/util.js');
import { $wuxToptips } from '../../dist/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelList: {},
    userData: "",
    shouquan: false,
    lazyloadBol: true,
    rotateBol: false,
    starArr: [],
    likeArr: []
  },
  // 查看详情
  todetail(e) {
    let id = e.currentTarget.dataset.id
    console.log(e)

    wx.navigateTo({
      url: '../editTravel/editTravel?id=' + id,
    })
  },

  // 初始化点赞图标
  initLikeArr() {
    let copy = this.data.userData.likeArr;
    let copy1 = this.data.travelList;
    let arr = this.data.likeArr;
    let bol = false;
    // console.log(copy)
    if (copy.length == 0) {
      for (var i = 0; i < copy1.length; i++) {
        arr[i] = 0;
        // bol = false;
      }
    } else {

      for (var i = 0; i < copy1.length; i++) {

        bol = copy.some(function (item, index) {
          if (copy1[i]['_id'] == item) {
            arr[i] = 1;
            return true;
          } else {
            arr[i] = 0;
            return false;
          }
        })

      }

      // if(bol)

    }
    // console.log(arr);

    this.setData({
      likeArr: arr
    })

  },
  // 初始化收藏图标
  initStarArr() {
    let copy = this.data.userData.starArr;
    let copy1 = this.data.travelList;
    let arr = this.data.starArr;

    let bol = false;
    // console.log(copy)
    if (copy.length == 0) {
      for (var i = 0; i < copy1.length; i++) {
        arr[i] = 0;
        // bol = false;
      }
    } else {

      for (var i = 0; i < copy1.length; i++) {

        bol = copy.some(function (item, index) {
          if (copy1[i]['_id'] == item) {
            arr[i] = 1;
            return true;
          } else {
            arr[i] = 0;
            return false;
          }
        })

      }
    }
    // console.log(arr);

    this.setData({
      starArr: arr
    })
  },
  //删除旅行
  delTravel(e) {
    let that = this;
    let bol = e.currentTarget.dataset.lock;

    if (bol == false) {
      wx.showModal({
        title: '是否锁定',
        content: '锁定后他人将不能查看你的旅行日记',
        success(res) {
          if (res.confirm) {
            let db = wx.cloud.database();
            db.collection('travel').doc(e.currentTarget.dataset.id).update({
              data: {
                data: {
                  lock: !bol
                }
              },
              success(res) {
                var copy = that.data.travelList;
                var copyBol = copy[e.currentTarget.dataset.index].data.lock;
                copyBol = !bol;
                copy[e.currentTarget.dataset.index].data.lock = copyBol;
                that.setData({
                  travelList: copy
                })
              }
            });
          } else {
            //none
          }
        }
      })
    } 
    else {
      wx.showModal({
        title: '是否解锁',
        content: '解锁后他人将能查看你的旅行日记',
        success(res) {
          if (res.confirm) {
            let db = wx.cloud.database();
            db.collection('travel').doc(e.currentTarget.dataset.id).update({
              data: {
                data: {
                  lock: !bol
                }
              },
              success(res) {
                var copy = that.data.travelList;
                var copyBol = copy[e.currentTarget.dataset.index].data.lock;
                copyBol = !bol;
                copy[e.currentTarget.dataset.index].data.lock = copyBol;
                that.setData({
                  travelList: copy
                })
              }
            });
          } else {
            //none
          }
        }
      })
    }




    // console.log(e.currentTarget.dataset.id);
    // let db = wx.cloud.database();
    // let bol = e.currentTarget.dataset.lock;
    // db.collection('travel').doc(e.currentTarget.dataset.id).update({
    //   data: {
    //     data: {
    //       lock: !bol
    //     }
    //   },
    //   success(res) {
    //     var copy = that.data.travelList;
    //     var copyBol = copy[e.currentTarget.dataset.index].data.lock;
    //     copyBol = !bol;
    //     copy[e.currentTarget.dataset.index].data.lock = copyBol;
    //     that.setData({  
    //       travelList:copy
    //     })
    //   }
    // });

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // that.getInit();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    let db = wx.cloud.database();
    let openid = wx.getStorageSync('openid');

    let userData1 = db.collection('travel').where({
      _openid: openid
    }).get();

    var mydata;
    Promise.resolve(userData1).then(function (res) {
      mydata = res.data[0]
      console.log(res.data[0]);
      that.setData({
        travelList: res.data
      })
      wx.stopPullDownRefresh();
      let timer1 = null;
      clearInterval(timer1);
      timer1 = setInterval(function () {
        if (app.globalData.login) {
          that.initUser();
          clearInterval(timer1);
        }
      }, 200)
    })
  },
  initUser() {
    let that = this;
    let openid = wx.getStorageSync('openid')
    let db = wx.cloud.database();

    // let _ = db.command;
    let userData1 = db.collection('users').where({
      _openid: openid
    }).get();

    var mydata;
    Promise.resolve(userData1).then(function (res) {
      mydata = res.data[0]
      // console.log(res.data[0]);
      that.setData({
        userData: mydata
      });
      that.initLikeArr();
      that.initStarArr();
    })
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
    var that = this;
    let db = wx.cloud.database();
    let openid = wx.getStorageSync('openid');

    let userData1 = db.collection('travel').where({
      _openid: openid
    }).get();

    var mydata;
    Promise.resolve(userData1).then(function (res) {
      mydata = res.data[0]
      console.log(res.data[0]);
      that.setData({
        travelList: res.data
      })
      wx.stopPullDownRefresh();
      let timer1 = null;
      clearInterval(timer1);
      timer1 = setInterval(function () {
        if (app.globalData.login) {
          that.initUser();
          clearInterval(timer1);
        }
      }, 200)
    })
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