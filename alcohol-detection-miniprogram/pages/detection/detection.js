// pages/detection/detection.js
Page({
  data: {
    // 摄像头设置
    cameraPosition: 'back', // back, front
    flashMode: 'off', // off, on, auto
    
    // 检测状态
    isReady: false,
    isDetecting: false,
    hasResult: false,
    
    // 检测数据
    currentValue: 0.000,
    temperature: 25,
    humidity: 60,
    detectionTime: 0,
    detectionProgress: 0,
    
    // 结果数据
    showResult: false,
    resultData: {
      value: 0.000,
      status: 'normal', // normal, abnormal
      time: '',
      location: '',
      temperature: 25
    },
    
    // 定时器
    detectionTimer: null,
    progressTimer: null,
    valueUpdateTimer: null
  },

  onLoad: function (options) {
    this.initDetection();
    this.getLocation();
    this.getEnvironmentData();
  },

  onShow: function () {
    // 页面显示时重新初始化摄像头
    this.setData({
      isReady: false
    });
  },

  onHide: function () {
    // 页面隐藏时停止检测
    if (this.data.isDetecting) {
      this.stopDetection();
    }
  },

  onUnload: function () {
    // 清理定时器
    this.clearAllTimers();
  },

  // 初始化检测
  initDetection: function() {
    wx.showLoading({
      title: '初始化中...'
    });
    
    // 模拟初始化过程
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        isReady: true
      });
      wx.showToast({
        title: '设备就绪',
        icon: 'success',
        duration: 1500
      });
    }, 2000);
  },

  // 摄像头就绪
  onCameraReady: function() {
    console.log('摄像头就绪');
    this.setData({
      isReady: true
    });
  },

  // 摄像头错误
  onCameraError: function(e) {
    console.error('摄像头错误:', e.detail);
    wx.showModal({
      title: '摄像头错误',
      content: '无法访问摄像头，请检查权限设置',
      showCancel: false
    });
  },

  // 摄像头停止
  onCameraStop: function() {
    console.log('摄像头停止');
    if (this.data.isDetecting) {
      this.stopDetection();
    }
  },

  // 切换摄像头
  switchCamera: function() {
    if (this.data.isDetecting) {
      wx.showToast({
        title: '检测中无法切换',
        icon: 'none'
      });
      return;
    }
    
    const newPosition = this.data.cameraPosition === 'back' ? 'front' : 'back';
    this.setData({
      cameraPosition: newPosition
    });
    
    wx.showToast({
      title: `已切换到${newPosition === 'back' ? '后' : '前'}置摄像头`,
      icon: 'none'
    });
  },

  // 切换闪光灯
  toggleFlash: function() {
    const newFlashMode = this.data.flashMode === 'off' ? 'on' : 'off';
    this.setData({
      flashMode: newFlashMode
    });
    
    wx.showToast({
      title: `闪光灯已${newFlashMode === 'on' ? '开启' : '关闭'}`,
      icon: 'none'
    });
  },

  // 开始检测
  startDetection: function() {
    if (!this.data.isReady) {
      wx.showToast({
        title: '设备未就绪',
        icon: 'none'
      });
      return;
    }

    this.setData({
      isDetecting: true,
      detectionTime: 0,
      detectionProgress: 0,
      currentValue: 0.000,
      hasResult: false
    });

    // 开始录制视频（如果需要）
    this.startRecording();

    // 开始检测计时
    this.startDetectionTimer();
    
    // 开始进度更新
    this.startProgressTimer();
    
    // 开始数值更新
    this.startValueUpdate();

    wx.showToast({
      title: '开始检测',
      icon: 'success'
    });
  },

  // 停止检测
  stopDetection: function() {
    this.clearAllTimers();
    
    this.setData({
      isDetecting: false,
      detectionProgress: 100
    });

    // 停止录制
    this.stopRecording();

    // 生成检测结果
    this.generateResult();

    wx.showToast({
      title: '检测完成',
      icon: 'success'
    });
  },

  // 重置检测
  resetDetection: function() {
    this.clearAllTimers();
    
    this.setData({
      isDetecting: false,
      hasResult: false,
      currentValue: 0.000,
      detectionTime: 0,
      detectionProgress: 0,
      showResult: false
    });

    wx.showToast({
      title: '已重置',
      icon: 'success'
    });
  },

  // 开始录制视频
  startRecording: function() {
    const ctx = wx.createCameraContext();
    ctx.startRecord({
      success: (res) => {
        console.log('开始录制视频');
      },
      fail: (err) => {
        console.error('录制失败:', err);
      }
    });
  },

  // 停止录制
  stopRecording: function() {
    const ctx = wx.createCameraContext();
    ctx.stopRecord({
      success: (res) => {
        console.log('录制完成:', res.tempVideoPath);
        // 保存视频路径用于后续使用
        this.videoPath = res.tempVideoPath;
      },
      fail: (err) => {
        console.error('停止录制失败:', err);
      }
    });
  },

  // 开始检测计时
  startDetectionTimer: function() {
    this.data.detectionTimer = setInterval(() => {
      this.setData({
        detectionTime: this.data.detectionTime + 1
      });
    }, 1000);
  },

  // 开始进度更新
  startProgressTimer: function() {
    const totalTime = 30; // 30秒检测时间
    const interval = 100; // 100ms更新一次
    const increment = 100 / (totalTime * 1000 / interval);
    
    this.data.progressTimer = setInterval(() => {
      let newProgress = this.data.detectionProgress + increment;
      if (newProgress >= 100) {
        newProgress = 100;
        this.stopDetection();
      }
      this.setData({
        detectionProgress: Math.round(newProgress)
      });
    }, interval);
  },

  // 开始数值更新
  startValueUpdate: function() {
    this.data.valueUpdateTimer = setInterval(() => {
      // 模拟酒精检测数值变化
      const baseValue = Math.random() * 0.1;
      const variation = (Math.random() - 0.5) * 0.02;
      const newValue = Math.max(0, baseValue + variation);
      
      this.setData({
        currentValue: newValue
      });
    }, 500);
  },

  // 清理所有定时器
  clearAllTimers: function() {
    if (this.data.detectionTimer) {
      clearInterval(this.data.detectionTimer);
      this.data.detectionTimer = null;
    }
    if (this.data.progressTimer) {
      clearInterval(this.data.progressTimer);
      this.data.progressTimer = null;
    }
    if (this.data.valueUpdateTimer) {
      clearInterval(this.data.valueUpdateTimer);
      this.data.valueUpdateTimer = null;
    }
  },

  // 生成检测结果
  generateResult: function() {
    const finalValue = this.data.currentValue;
    const status = finalValue >= 0.2 ? 'abnormal' : 'normal';
    const now = new Date();
    
    const resultData = {
      value: finalValue.toFixed(3),
      status: status,
      time: this.formatDateTime(now),
      location: this.currentLocation || '未知位置',
      temperature: this.data.temperature,
      humidity: this.data.humidity,
      duration: this.data.detectionTime,
      videoPath: this.videoPath
    };

    this.setData({
      resultData: resultData,
      hasResult: true,
      showResult: true
    });
  },

  // 获取位置信息
  getLocation: function() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        // 这里可以根据经纬度获取具体地址
        this.currentLocation = `${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)}`;
      },
      fail: () => {
        this.currentLocation = '位置获取失败';
      }
    });
  },

  // 获取环境数据
  getEnvironmentData: function() {
    // 模拟环境数据获取
    // 实际应用中可能通过蓝牙连接传感器获取
    const temperature = 20 + Math.random() * 10;
    const humidity = 40 + Math.random() * 40;
    
    this.setData({
      temperature: Math.round(temperature),
      humidity: Math.round(humidity)
    });
  },

  // 保存记录
  saveRecord: function() {
    if (!this.data.hasResult) {
      wx.showToast({
        title: '暂无检测结果',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中...'
    });

    // 模拟保存到服务器
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
      
      // 保存到本地存储
      this.saveToLocal();
    }, 1000);
  },

  // 保存到本地存储
  saveToLocal: function() {
    const records = wx.getStorageSync('detectionRecords') || [];
    const newRecord = {
      id: Date.now(),
      ...this.data.resultData,
      createTime: new Date().toISOString()
    };
    
    records.unshift(newRecord);
    wx.setStorageSync('detectionRecords', records);
  },

  // 查看历史记录
  viewHistory: function() {
    wx.switchTab({
      url: '/pages/records/records'
    });
  },

  // 关闭结果弹窗
  closeResult: function() {
    this.setData({
      showResult: false
    });
  },

  // 保存并关闭
  saveAndClose: function() {
    this.saveRecord();
    setTimeout(() => {
      this.closeResult();
    }, 1500);
  },

  // 立即复检
  retestNow: function() {
    this.closeResult();
    setTimeout(() => {
      this.resetDetection();
      this.startDetection();
    }, 500);
  },

  // 防止弹窗滚动穿透
  preventTouchMove: function() {
    return false;
  },

  // 格式化时间
  formatTime: function(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // 格式化日期时间
  formatDateTime: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});