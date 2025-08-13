// app.js
App({
  // 全局数据
  globalData: {
    userInfo: null,
    systemInfo: null,
    hasLogin: false,
    apiBaseUrl: 'https://api.alcohol-detection.com',
    version: '1.0.0'
  },

  // 小程序初始化
  onLaunch: function (options) {
    console.log('小程序启动', options);
    
    // 获取系统信息
    this.getSystemInfo();
    
    // 检查更新
    this.checkForUpdate();
    
    // 初始化用户数据
    this.initUserData();
    
    // 设置全局错误处理
    this.setGlobalErrorHandler();
  },

  // 小程序显示
  onShow: function (options) {
    console.log('小程序显示', options);
    
    // 记录用户活跃
    this.recordUserActivity();
  },

  // 小程序隐藏
  onHide: function () {
    console.log('小程序隐藏');
    
    // 保存用户数据
    this.saveUserData();
  },

  // 小程序错误
  onError: function (msg) {
    console.error('小程序错误:', msg);
    
    // 错误上报
    this.reportError(msg);
  },

  // 页面不存在
  onPageNotFound: function (res) {
    console.log('页面不存在:', res);
    
    // 重定向到首页
    wx.redirectTo({
      url: '/pages/index/index'
    });
  },

  // 获取系统信息
  getSystemInfo: function() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      
      console.log('系统信息:', systemInfo);
      
      // 适配不同设备
      this.adaptDevice(systemInfo);
    } catch (e) {
      console.error('获取系统信息失败:', e);
    }
  },

  // 设备适配
  adaptDevice: function(systemInfo) {
    // iPhone X 系列适配
    if (systemInfo.model.indexOf('iPhone X') !== -1 || 
        systemInfo.model.indexOf('iPhone 11') !== -1 ||
        systemInfo.model.indexOf('iPhone 12') !== -1 ||
        systemInfo.model.indexOf('iPhone 13') !== -1 ||
        systemInfo.model.indexOf('iPhone 14') !== -1) {
      this.globalData.isIPhoneX = true;
    }
    
    // 设置状态栏高度
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    
    // 设置安全区域
    this.globalData.safeArea = systemInfo.safeArea;
  },

  // 检查小程序更新
  checkForUpdate: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate(function (res) {
        console.log('检查更新结果:', res.hasUpdate);
      });
      
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
      
      updateManager.onUpdateFailed(function () {
        wx.showModal({
          title: '更新失败',
          content: '新版本下载失败，请删除小程序后重新搜索打开',
          showCancel: false
        });
      });
    }
  },

  // 初始化用户数据
  initUserData: function() {
    try {
      // 从本地存储获取用户信息
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.hasLogin = true;
      }
      
      // 初始化应用设置
      const appSettings = wx.getStorageSync('appSettings');
      if (!appSettings) {
        const defaultSettings = {
          notifications: true,
          autoBackup: false,
          privacyMode: false,
          theme: 'light'
        };
        wx.setStorageSync('appSettings', defaultSettings);
      }
      
    } catch (e) {
      console.error('初始化用户数据失败:', e);
    }
  },

  // 设置全局错误处理
  setGlobalErrorHandler: function() {
    // 监听未处理的 Promise 错误
    wx.onUnhandledRejection(function(res) {
      console.error('未处理的Promise错误:', res);
    });
    
    // 监听内存不足警告
    wx.onMemoryWarning(function() {
      console.warn('内存不足警告');
      // 清理不必要的资源
    });
  },

  // 记录用户活跃
  recordUserActivity: function() {
    const now = new Date();
    const today = now.toDateString();
    
    try {
      let activityData = wx.getStorageSync('userActivity') || {};
      
      // 记录今日活跃
      if (activityData.lastActiveDate !== today) {
        activityData.lastActiveDate = today;
        activityData.activeDays = (activityData.activeDays || 0) + 1;
        activityData.lastActiveTime = now.toISOString();
        
        wx.setStorageSync('userActivity', activityData);
      }
    } catch (e) {
      console.error('记录用户活跃失败:', e);
    }
  },

  // 保存用户数据
  saveUserData: function() {
    try {
      if (this.globalData.userInfo) {
        wx.setStorageSync('userInfo', this.globalData.userInfo);
      }
    } catch (e) {
      console.error('保存用户数据失败:', e);
    }
  },

  // 错误上报
  reportError: function(error) {
    // 这里可以实现错误上报逻辑
    console.log('上报错误:', error);
  },

  // 工具方法：格式化日期
  formatDate: function(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second);
  },

  // 工具方法：显示加载提示
  showLoading: function(title = '加载中...', mask = true) {
    wx.showLoading({
      title: title,
      mask: mask
    });
  },

  // 工具方法：隐藏加载提示
  hideLoading: function() {
    wx.hideLoading();
  },

  // 工具方法：显示成功提示
  showSuccess: function(title, duration = 1500) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: duration
    });
  },

  // 工具方法：显示错误提示
  showError: function(title, duration = 2000) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: duration
    });
  },

  // 工具方法：确认对话框
  showConfirm: function(content, title = '提示') {
    return new Promise((resolve) => {
      wx.showModal({
        title: title,
        content: content,
        success: function(res) {
          resolve(res.confirm);
        }
      });
    });
  }
});