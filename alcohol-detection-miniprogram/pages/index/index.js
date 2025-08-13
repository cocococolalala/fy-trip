// pages/index/index.js
Page({
  data: {
    // 最后一次检测数据
    lastDetection: {
      status: 'normal', // normal, abnormal
      value: 0.05,
      time: '2024-01-15 14:30'
    },
    
    // 是否有异常记录
    hasAbnormalRecord: true,
    abnormalRecord: {
      time: '2024-01-14 09:15',
      value: 0.28
    },
    
    // 最近检测记录
    recentRecords: [
      {
        id: 1,
        date: '今天 14:30',
        location: '办公室',
        value: 0.05,
        status: 'normal'
      },
      {
        id: 2,
        date: '昨天 09:15',
        location: '停车场',
        value: 0.28,
        status: 'abnormal'
      },
      {
        id: 3,
        date: '01-13 16:45',
        location: '家中',
        value: 0.02,
        status: 'normal'
      }
    ],
    
    // 统计数据
    stats: {
      total: 15,
      normal: 12,
      abnormal: 2,
      retest: 1
    }
  },

  onLoad: function (options) {
    this.loadUserData();
    this.checkAbnormalRecords();
  },

  onShow: function () {
    // 页面显示时刷新数据
    this.refreshData();
  },

  // 加载用户数据
  loadUserData: function() {
    // 从本地存储或服务器获取用户数据
    const userData = wx.getStorageSync('userData') || {};
    if (userData.lastDetection) {
      this.setData({
        lastDetection: userData.lastDetection
      });
    }
    
    if (userData.stats) {
      this.setData({
        stats: userData.stats
      });
    }
  },

  // 检查异常记录
  checkAbnormalRecords: function() {
    // 检查是否有未处理的异常记录
    const abnormalRecords = this.data.recentRecords.filter(record => 
      record.status === 'abnormal'
    );
    
    if (abnormalRecords.length > 0) {
      this.setData({
        hasAbnormalRecord: true,
        abnormalRecord: {
          time: abnormalRecords[0].date,
          value: abnormalRecords[0].value
        }
      });
    }
  },

  // 刷新数据
  refreshData: function() {
    wx.showLoading({
      title: '加载中...'
    });
    
    // 模拟数据刷新
    setTimeout(() => {
      wx.hideLoading();
      // 这里可以调用API刷新数据
      this.loadRecentRecords();
    }, 500);
  },

  // 加载最近记录
  loadRecentRecords: function() {
    // 模拟从服务器获取最近记录
    // 实际开发中这里应该是API调用
    console.log('加载最近检测记录');
  },

  // 开始检测
  startDetection: function() {
    wx.showToast({
      title: '准备检测...',
      icon: 'loading',
      duration: 1000
    });
    
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/detection/detection'
      });
    }, 1000);
  },

  // 跳转到记录页面
  goToRecords: function() {
    wx.switchTab({
      url: '/pages/records/records'
    });
  },

  // 跳转到记录详情
  goToRecordDetail: function(e) {
    const recordId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/record-detail/record-detail?id=${recordId}`
    });
  },

  // 复检
  retest: function(e) {
    const recordId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认复检',
      content: '确定要对此异常记录进行复检吗？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/retest/retest?recordId=${recordId}`
          });
        }
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.refreshData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '酒精检测小程序',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    };
  }
});