Page({
  onLoad() {
    getApp().globalData.entryView = "profile";
    wx.reLaunch({ url: "/pages/demo/demo?view=profile" });
  }
});
