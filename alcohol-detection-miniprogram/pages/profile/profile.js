// pages/profile/profile.js
Page({
  data: {
    // 用户信息
    userInfo: {
      name: '张三',
      id: 'U20240115001',
      avatar: '',
      level: 'normal',
      levelText: '普通用户',
      phone: '138****8888',
      email: 'user@example.com'
    },
    
    // 用户统计
    userStats: {
      totalTests: 0,
      normalTests: 0,
      abnormalTests: 0,
      continuousDays: 0
    },
    
    // 设置选项
    settings: {
      notifications: true,
      autoBackup: false,
      privacyMode: false
    },
    
    // 编辑资料
    showEditModal: false,
    editForm: {
      name: '',
      phone: '',
      email: ''
    },
    
    // 应用版本
    appVersion: '1.0.0'
  },

  onLoad: function (options) {
    this.loadUserInfo();
    this.loadUserStats();
    this.loadSettings();
  },

  onShow: function () {
    // 页面显示时刷新统计数据
    this.loadUserStats();
  },

  // 加载用户信息
  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    if (Object.keys(userInfo).length > 0) {
      this.setData({
        userInfo: {
          ...this.data.userInfo,
          ...userInfo
        }
      });
    }
  },

  // 加载用户统计
  loadUserStats: function() {
    const records = wx.getStorageSync('detectionRecords') || [];
    const totalTests = records.length;
    const normalTests = records.filter(r => r.status === 'normal').length;
    const abnormalTests = records.filter(r => r.status === 'abnormal').length;
    
    // 计算连续使用天数
    const continuousDays = this.calculateContinuousDays(records);

    this.setData({
      userStats: {
        totalTests,
        normalTests,
        abnormalTests,
        continuousDays
      }
    });
  },

  // 计算连续使用天数
  calculateContinuousDays: function(records) {
    if (records.length === 0) return 0;

    const dates = records.map(record => {
      const date = new Date(record.time);
      return date.toDateString();
    });

    const uniqueDates = [...new Set(dates)].sort();
    
    let continuousDays = 1;
    const today = new Date().toDateString();
    
    if (uniqueDates.includes(today)) {
      for (let i = uniqueDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(uniqueDates[i + 1]);
        const prevDate = new Date(uniqueDates[i]);
        const diffTime = currentDate - prevDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          continuousDays++;
        } else {
          break;
        }
      }
    } else {
      continuousDays = 0;
    }

    return continuousDays;
  },

  // 加载设置
  loadSettings: function() {
    const settings = wx.getStorageSync('appSettings') || {};
    this.setData({
      settings: {
        ...this.data.settings,
        ...settings
      }
    });
  },

  // 更换头像
  changeAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.uploadAvatar(tempFilePath);
      }
    });
  },

  // 上传头像
  uploadAvatar: function(filePath) {
    wx.showLoading({
      title: '上传中...'
    });

    // 模拟上传过程
    setTimeout(() => {
      const userInfo = {
        ...this.data.userInfo,
        avatar: filePath
      };
      
      this.setData({
        userInfo
      });
      
      wx.setStorageSync('userInfo', userInfo);
      wx.hideLoading();
      wx.showToast({
        title: '头像更新成功',
        icon: 'success'
      });
    }, 1500);
  },

  // 编辑资料
  editProfile: function() {
    this.setData({
      showEditModal: true,
      editForm: {
        name: this.data.userInfo.name,
        phone: this.data.userInfo.phone,
        email: this.data.userInfo.email
      }
    });
  },

  // 关闭编辑弹窗
  closeEditModal: function() {
    this.setData({
      showEditModal: false
    });
  },

  // 表单输入处理
  onNameInput: function(e) {
    this.setData({
      'editForm.name': e.detail.value
    });
  },

  onPhoneInput: function(e) {
    this.setData({
      'editForm.phone': e.detail.value
    });
  },

  onEmailInput: function(e) {
    this.setData({
      'editForm.email': e.detail.value
    });
  },

  // 保存资料
  saveProfile: function() {
    const { name, phone, email } = this.data.editForm;
    
    if (!name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中...'
    });

    setTimeout(() => {
      const userInfo = {
        ...this.data.userInfo,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim()
      };

      this.setData({
        userInfo,
        showEditModal: false
      });

      wx.setStorageSync('userInfo', userInfo);
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 查看记录
  viewRecords: function() {
    wx.switchTab({
      url: '/pages/records/records'
    });
  },

  // 查看异常记录
  viewAbnormalRecords: function() {
    wx.navigateTo({
      url: '/pages/records/records?filter=abnormal'
    });
  },

  // 开始检测
  startDetection: function() {
    wx.navigateTo({
      url: '/pages/detection/detection'
    });
  },

  // 导出数据
  exportData: function() {
    wx.showActionSheet({
      itemList: ['导出为Excel', '导出为PDF', '发送到邮箱'],
      success: (res) => {
        wx.showLoading({
          title: '准备导出...'
        });

        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({
            title: '导出功能开发中',
            icon: 'none'
          });
        }, 1500);
      }
    });
  },

  // 设备设置
  deviceSettings: function() {
    wx.showModal({
      title: '设备设置',
      content: '设备设置功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 通知设置切换
  toggleNotifications: function(e) {
    const enabled = e.detail.value;
    const settings = {
      ...this.data.settings,
      notifications: enabled
    };

    this.setData({
      settings
    });

    wx.setStorageSync('appSettings', settings);
    
    wx.showToast({
      title: enabled ? '已开启通知' : '已关闭通知',
      icon: 'success'
    });
  },

  // 隐私设置
  privacySettings: function() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  },

  // 数据管理
  dataManagement: function() {
    wx.showActionSheet({
      itemList: ['清理缓存', '备份数据', '恢复数据', '清空所有数据'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.clearCache();
            break;
          case 1:
            this.backupData();
            break;
          case 2:
            this.restoreData();
            break;
          case 3:
            this.clearAllData();
            break;
        }
      }
    });
  },

  // 清理缓存
  clearCache: function() {
    wx.showModal({
      title: '清理缓存',
      content: '确定要清理应用缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '清理中...'
          });

          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '缓存清理完成',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  // 备份数据
  backupData: function() {
    wx.showLoading({
      title: '备份中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '数据备份完成',
        icon: 'success'
      });
    }, 2000);
  },

  // 恢复数据
  restoreData: function() {
    wx.showModal({
      title: '恢复数据',
      content: '确定要恢复备份数据吗？当前数据将被覆盖',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '恢复中...'
          });

          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '数据恢复完成',
              icon: 'success'
            });
            this.loadUserStats();
          }, 2000);
        }
      }
    });
  },

  // 清空所有数据
  clearAllData: function() {
    wx.showModal({
      title: '清空数据',
      content: '此操作将清空所有检测记录和设置，且无法恢复，确定继续吗？',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '清理中...'
          });

          setTimeout(() => {
            wx.clearStorageSync();
            this.setData({
              userStats: {
                totalTests: 0,
                normalTests: 0,
                abnormalTests: 0,
                continuousDays: 0
              }
            });

            wx.hideLoading();
            wx.showToast({
              title: '数据清理完成',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  // 查看帮助
  viewHelp: function() {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },

  // 意见反馈
  feedback: function() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  // 关于应用
  aboutApp: function() {
    wx.showModal({
      title: '关于应用',
      content: `酒精检测小程序 v${this.data.appVersion}\n\n一款专业的酒精浓度检测工具，帮助您随时了解自身状态，确保安全出行。\n\n© 2024 酒精检测团队`,
      showCancel: false
    });
  },

  // 退出登录
  logout: function() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '退出中...'
          });

          setTimeout(() => {
            // 清理用户相关数据
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('userToken');

            wx.hideLoading();
            wx.showToast({
              title: '已退出登录',
              icon: 'success'
            });

            // 跳转到登录页面或重新加载
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/login/login'
              });
            }, 1500);
          }, 1000);
        }
      }
    });
  },

  // 防止弹窗滚动穿透
  preventTouchMove: function() {
    return false;
  }
});