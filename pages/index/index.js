//index.js
//获取应用实例
const app = getApp()
var colorUtil = require('/util/colordeal.js');
Page({
  data: {
    playMusicName: '自然风声',
    playMusicDes: '聆听大自然最质朴的声音',
    playBgOrignColor: '#005F8C',//历史颜色
    playBgClorStart: '#005F8C',//当前颜色
    playBgClorEnd: '#ffffff',//渐变色
    playIndex: 0,//当前播放的索引位置
    isPlay:false,
    userInfo: {},
    playsrc: '../res/wind128.png',
    playbtn: '../res/play.png',
    pausebtn: '../res/pause.png',
    prebtn: '../res/pre.png',
    nextbtn: '../res/next.png',
    listbtn: '../res/list.png',
    likebtn: '../res/like.png',
    cloud1: '../res/cloud_one.png',
    cloud2: '../res/cloud_two.png',
    cloud3: '../res/cloud_three.png',
    voice:'../res/voice.png',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isBottomSheetVisiable: false,//是否显示弹框标识

    //testData
    array: [{
      musicName: '自然风声',
      musicDes: '聆听大自然最质朴的声音',
      musicImg: '../res/wind.png',
      musicBgStart: '#005F8C',

    }, {
      musicName: '雷雨天气',
      musicDes: '打雷下雨的雨夜',
      musicImg: '../res/rain.png',
      musicBgStart: '#003162',

    }, {
      musicName: '沙漠风尘',
      musicDes: '沙漠深处的狂风',
      musicImg: '../res/rain.png',
      musicBgStart: '#B95C00',

    }, {
      musicName: '林中鸟语',
      musicDes: '林间小鸟的清越啼鸣',
      musicImg: '../res/rain.png',
      musicBgStart: '#119F11',

    }, {
      musicName: '深海之音',
      musicDes: '大海深处的水泡声音',
      musicImg: '../res/rain.png',
      musicBgStart: '#003973',

    }]

  },

  onReady: function () {
    this.drawBg()
    this.drawAnimaCloud()
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow() {


  },


  //绘图方式实现白云飘动
  drawAnimaCloud: function () {
    var that = this;
    var deviceWidth;
    wx.getSystemInfo({
      success: function (res) {
        deviceWidth = res.windowWidth;
      },
    })
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('cloudCanvas')
    var i = 0;//白云1速度基数
    var j = 0;//白芸2速度基数
    var k = 0;//白芸3速度基数

    setInterval(function () {
      if (i > deviceWidth) {
        i = -deviceWidth;
      }

      if (j > deviceWidth) {
        j = -deviceWidth;
      }
      if (k > deviceWidth) {
        k = -deviceWidth;
      }
      context.drawImage(that.data.cloud1, i - deviceWidth, 0, deviceWidth, 150)
      context.drawImage(that.data.cloud1, i, 0, deviceWidth, 150)
      context.drawImage(that.data.cloud2, j, 5, deviceWidth, 150)
      context.drawImage(that.data.cloud3, k, 10, deviceWidth, 150)
      context.draw()
      i += 0.5;
      j += 1;
      k += 1.25;
    }, 50)
  },

  //绘制渐变背景
  drawBg: function () {
    var height;
    var width;
    wx.getSystemInfo({
      success: function(res) {
        height=res.screenHeight;
        width=res.screenWidth;
      },
    })
    var context = wx.createCanvasContext('myCanvas')
    const grd = context.createLinearGradient(0, 0, 0, height)
    grd.addColorStop(0, this.data.playBgClorStart)
    grd.addColorStop(0.7, this.data.playBgClorEnd)
    grd.addColorStop(1, this.data.playBgClorStart)
    context.setFillStyle(grd)
    context.fillRect(0, 0, width, height)
    context.draw()
  },
  //渐变背景切换动画
  drawBgAnim: function () {
    var height;
    var width;
    wx.getSystemInfo({
      success: function (res) {
        height = res.screenHeight;
        width = res.screenWidth;
      },
    })
    var duration = 500;
    var step = 50;
    var orignColor = this.data.playBgOrignColor;
    var destiColor = this.data.playBgClorStart;
    //导航栏渐变
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: destiColor,
      animation: {
        duration: duration,
        timingFunc: 'linear'
      }
    });
    //获取渐变颜色值
    var array = [];
    array = colorUtil.gradient(orignColor, destiColor, step);
    var timeStep = duration / array.length;
    console.log(timeStep);
    var i = 0
    setInterval(function () {
      if (i < array.length) {
        var context = wx.createCanvasContext('myCanvas')
        const grd = context.createLinearGradient(0, 0, 0, height)
        grd.addColorStop(0, array[i])
        grd.addColorStop(0.7, '#ffffff')
        grd.addColorStop(1, array[i])
        context.setFillStyle(grd)
        context.fillRect(0, 0, width, height)
        context.draw()
        i++;
      }
    }, timeStep)


  },

  //列表按钮点击
  bindViewTap: function () {
    this.showModal()
  },



  // 列表弹框动画
  showModal: function () {
    var heightV = 300;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    var isV = false
    if (this.data.isBottomSheetVisiable == true) {
      animation.translateY(heightV).step()
      isV = false;

    } else {
      animation.translateY(-heightV).step()
      isV = true;
    }
    this.setData({
      animationAlert: animation.export(),
      isBottomSheetVisiable: isV,
    })
  },

  //隐藏弹框动画
  hideAlert: function () {
    var heightV = 300;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    var isV = false
    if (this.data.isBottomSheetVisiable == true) {
      animation.translateY(heightV).step()
      isV = false;

    }
    this.setData({
      animationAlert: animation.export(),
      isBottomSheetVisiable: isV,
    })
  },


  //点击弹框背景
  clickAlertBg: function () {
    this.showModal()
  },

  //点击列表item
  clickAlertList: function (event) {
    var origColor = this.data.playBgClorStart;//将当前颜色保存为历史颜色
    this.setData({
      playMusicName: event.currentTarget.dataset.name,
      playMusicDes: event.currentTarget.dataset.des,
      playBgOrignColor: origColor,
      playIndex: event.currentTarget.dataset.id,
      playBgClorStart: event.currentTarget.dataset.bgstart,
    })
    this.drawBgAnim()
  },
  //下一首
  clickNext: function () {
    var origColor = this.data.playBgClorStart;//将当前颜色保存为历史颜色
    var array = [];
    array = this.data.array;
    if (this.data.playIndex+1 > array.length - 1) {
      this.setData({
        playIndex: -1,
      })
    }

    this.setData({
      playMusicName: array[this.data.playIndex + 1].musicName,
      playMusicDes: array[this.data.playIndex + 1].musicDes,
      playBgOrignColor: origColor,
      playIndex: this.data.playIndex + 1,
      playBgClorStart: array[this.data.playIndex + 1].musicBgStart,
    })
    this.drawBgAnim()

  },
  //上一首
  clickPre: function () {
    var origColor = this.data.playBgClorStart;//将当前颜色保存为历史颜色
    var array = [];
    array = this.data.array;
    if (this.data.playIndex-1 < 0) {
      this.setData({
        playIndex: array.length
      })
    }

    this.setData({
      playMusicName: array[this.data.playIndex - 1].musicName,
      playMusicDes: array[this.data.playIndex - 1].musicDes,
      playBgOrignColor: origColor,
      playIndex: this.data.playIndex - 1,
      playBgClorStart: array[this.data.playIndex - 1].musicBgStart,
    })
    this.drawBgAnim()

  },

  //播放点击事件
  playMusic:function(){
    var that=this
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    var isp=this.data.isPlay==true?false:true;
    if(isp==true){
      if(backgroundAudioManager.src==null){
        backgroundAudioManager.title = '此时此刻'
        backgroundAudioManager.epname = '此时此刻'
        backgroundAudioManager.singer = '许巍'
        backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
        backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46' 
      }else{
        backgroundAudioManager.play();
      }
    }else{
      backgroundAudioManager.pause();
    }
    //播放监听
    backgroundAudioManager.onPlay(function(){
      that.setData({
        isPlay:true
      })
      
    })
    //暂停监听
    backgroundAudioManager.onPause(function () {
      that.setData({
        isPlay: false
      })
    })
    //停止监听
    backgroundAudioManager.onStop(function () {
      that.setData({
        isPlay: false
      })
    })
    

    
  },

  error(e) {
    console.log(e.detail)
  }

})
