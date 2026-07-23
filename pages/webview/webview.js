Page({
  onLoad() {
    getApp().globalData.entryView = "home";
    wx.reLaunch({ url: "/pages/demo/demo" });
  }
});
