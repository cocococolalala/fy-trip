// pages/records/records.js
Page({
  data: {
    // 原始记录数据
    records: [],
    // 筛选后的记录
    filteredRecords: [],
    
    // 统计数据
    totalRecords: 0,
    normalCount: 0,
    abnormalCount: 0,
    retestCount: 0,
    
    // 筛选条件
    showFilterPanel: false,
    filterStatus: 'all', // all, normal, abnormal
    startDate: '',
    endDate: '',
    sortBy: 'time', // time, value
    
    // 分页
    currentPage: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
  },

  onLoad: function (options) {
    this.loadRecords();
  },

  onShow: function () {
    // 页面显示时刷新数据
    this.loadRecords();
  },

  onPullDownRefresh: function () {
    this.refreshData();
  },

  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  // 加载记录数据
  loadRecords: function() {
    wx.showLoading({
      title: '加载中...'
    });

    // 从本地存储获取记录
    const records = wx.getStorageSync('detectionRecords') || [];
    
    // 生成模拟数据（如果没有真实数据）
    if (records.length === 0) {
      this.generateMockData();
      return;
    }

    // 处理记录数据
    const processedRecords = records.map(record => ({
      ...record,
      expanded: false,
      retests: record.retests || []
    }));

    this.setData({
      records: processedRecords
    });

    this.calculateStats();
    this.applyFilter();
    
    wx.hideLoading();
  },

  // 生成模拟数据
  generateMockData: function() {
    const mockRecords = [
      {
        id: 1,
        time: '2024-01-15 14:30',
        location: '办公室',
        value: '0.050',
        status: 'normal',
        temperature: 25,
        humidity: 60,
        duration: 30,
        deviceId: 'AD001',
        videoPath: '/temp/video1.mp4',
        expanded: false,
        retests: []
      },
      {
        id: 2,
        time: '2024-01-14 09:15',
        location: '停车场',
        value: '0.280',
        status: 'abnormal',
        temperature: 22,
        humidity: 55,
        duration: 25,
        deviceId: 'AD001',
        videoPath: '/temp/video2.mp4',
        expanded: false,
        retests: [
          {
            time: '2024-01-14 09:20',
            value: '0.260',
            status: 'abnormal'
          }
        ]
      },
      {
        id: 3,
        time: '2024-01-13 16:45',
        location: '家中',
        value: '0.020',
        status: 'normal',
        temperature: 24,
        humidity: 65,
        duration: 28,
        deviceId: 'AD001',
        videoPath: '/temp/video3.mp4',
        expanded: false,
        retests: []
      },
      {
        id: 4,
        time: '2024-01-12 11:30',
        location: '公司门口',
        value: '0.150',
        status: 'abnormal',
        temperature: 20,
        humidity: 50,
        duration: 32,
        deviceId: 'AD001',
        expanded: false,
        retests: [
          {
            time: '2024-01-12 11:35',
            value: '0.030',
            status: 'normal'
          }
        ]
      },
      {
        id: 5,
        time: '2024-01-11 08:20',
        location: '地下车库',
        value: '0.010',
        status: 'normal',
        temperature: 18,
        humidity: 70,
        duration: 26,
        deviceId: 'AD001',
        expanded: false,
        retests: []
      }
    ];

    this.setData({
      records: mockRecords
    });

    this.calculateStats();
    this.applyFilter();
    
    wx.hideLoading();
  },

  // 计算统计数据
  calculateStats: function() {
    const records = this.data.records;
    const totalRecords = records.length;
    const normalCount = records.filter(r => r.status === 'normal').length;
    const abnormalCount = records.filter(r => r.status === 'abnormal').length;
    const retestCount = records.filter(r => r.retests && r.retests.length > 0).length;

    this.setData({
      totalRecords,
      normalCount,
      abnormalCount,
      retestCount
    });
  },

  // 显示/隐藏筛选面板
  showFilter: function() {
    this.setData({
      showFilterPanel: !this.data.showFilterPanel
    });
  },

  // 设置筛选状态
  setFilterStatus: function(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      filterStatus: status
    });
  },

  // 开始日期变化
  onStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    });
  },

  // 结束日期变化
  onEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    });
  },

  // 重置筛选条件
  resetFilter: function() {
    this.setData({
      filterStatus: 'all',
      startDate: '',
      endDate: ''
    });
    this.applyFilter();
  },

  // 应用筛选
  applyFilter: function() {
    let filteredRecords = [...this.data.records];

    // 状态筛选
    if (this.data.filterStatus !== 'all') {
      filteredRecords = filteredRecords.filter(record => 
        record.status === this.data.filterStatus
      );
    }

    // 日期筛选
    if (this.data.startDate) {
      filteredRecords = filteredRecords.filter(record => 
        record.time >= this.data.startDate
      );
    }
    
    if (this.data.endDate) {
      filteredRecords = filteredRecords.filter(record => 
        record.time <= this.data.endDate + ' 23:59:59'
      );
    }

    // 排序
    this.sortRecords(filteredRecords);

    this.setData({
      filteredRecords,
      showFilterPanel: false
    });

    wx.showToast({
      title: `找到 ${filteredRecords.length} 条记录`,
      icon: 'none'
    });
  },

  // 设置排序方式
  setSortBy: function(e) {
    const sortBy = e.currentTarget.dataset.sort;
    this.setData({
      sortBy
    });
    
    let filteredRecords = [...this.data.filteredRecords];
    this.sortRecords(filteredRecords);
    
    this.setData({
      filteredRecords
    });
  },

  // 排序记录
  sortRecords: function(records) {
    if (this.data.sortBy === 'time') {
      records.sort((a, b) => new Date(b.time) - new Date(a.time));
    } else if (this.data.sortBy === 'value') {
      records.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
    }
  },

  // 切换记录详情展开状态
  toggleRecordDetail: function(e) {
    const recordId = e.currentTarget.dataset.id;
    const filteredRecords = this.data.filteredRecords.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          expanded: !record.expanded
        };
      }
      return record;
    });

    this.setData({
      filteredRecords
    });
  },

  // 查看视频
  viewVideo: function(e) {
    const recordId = e.currentTarget.dataset.id;
    const record = this.data.filteredRecords.find(r => r.id === recordId);
    
    if (!record || !record.videoPath) {
      wx.showToast({
        title: '视频不存在',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/video-player/video-player?path=${encodeURIComponent(record.videoPath)}&title=检测视频`
    });
  },

  // 分享记录
  shareRecord: function(e) {
    const recordId = e.currentTarget.dataset.id;
    const record = this.data.filteredRecords.find(r => r.id === recordId);
    
    if (!record) return;

    wx.showActionSheet({
      itemList: ['生成报告', '分享给好友', '导出数据'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.generateReport(record);
            break;
          case 1:
            this.shareToFriend(record);
            break;
          case 2:
            this.exportData(record);
            break;
        }
      }
    });
  },

  // 复检记录
  retestRecord: function(e) {
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

  // 删除记录
  deleteRecord: function(e) {
    const recordId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除此记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.performDelete(recordId);
        }
      }
    });
  },

  // 执行删除操作
  performDelete: function(recordId) {
    wx.showLoading({
      title: '删除中...'
    });

    // 从本地存储中删除
    const records = wx.getStorageSync('detectionRecords') || [];
    const updatedRecords = records.filter(r => r.id !== recordId);
    wx.setStorageSync('detectionRecords', updatedRecords);

    // 更新页面数据
    const filteredRecords = this.data.filteredRecords.filter(r => r.id !== recordId);
    const allRecords = this.data.records.filter(r => r.id !== recordId);
    
    this.setData({
      records: allRecords,
      filteredRecords
    });

    this.calculateStats();

    wx.hideLoading();
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  },

  // 导出记录
  exportRecords: function() {
    wx.showActionSheet({
      itemList: ['导出为Excel', '导出为PDF', '发送到邮箱'],
      success: (res) => {
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
      }
    });
  },

  // 开始检测
  startDetection: function() {
    wx.navigateTo({
      url: '/pages/detection/detection'
    });
  },

  // 加载更多
  loadMore: function() {
    if (this.data.loading) return;

    this.setData({
      loading: true
    });

    // 模拟加载更多数据
    setTimeout(() => {
      this.setData({
        loading: false,
        hasMore: false // 模拟没有更多数据
      });
      
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      });
    }, 1000);
  },

  // 刷新数据
  refreshData: function() {
    this.setData({
      currentPage: 1,
      hasMore: true
    });
    
    this.loadRecords();
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 生成报告
  generateReport: function(record) {
    wx.showLoading({
      title: '生成中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '报告已生成',
        icon: 'success'
      });
    }, 2000);
  },

  // 分享给好友
  shareToFriend: function(record) {
    // 实现分享逻辑
    console.log('分享记录:', record);
  },

  // 导出数据
  exportData: function(record) {
    wx.showLoading({
      title: '导出中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '导出成功',
        icon: 'success'
      });
    }, 1500);
  }
});