import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const pageDir = path.join(root, "pages", "demo");
const jsPath = path.join(pageDir, "demo.js");
const wxmlPath = path.join(pageDir, "demo.wxml");
const wxssPath = path.join(pageDir, "demo.wxss");
const popWxssPath = path.join(pageDir, "pop-theme.wxss");

for (const file of [
  "app.json",
  "sitemap.json",
  "project.config.json",
  "pages/demo/demo.json",
  "pages/home/home.json",
  "pages/index/index.json",
  "pages/history/history.json",
  "pages/account/account.json",
  "pages/project-preview/project-preview.json",
  "pages/robot-config/robot-config.json",
  "pages/webview/webview.json"
]) {
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

const appConfig = JSON.parse(fs.readFileSync(path.join(root, "app.json"), "utf8"));
const projectConfig = JSON.parse(fs.readFileSync(path.join(root, "project.config.json"), "utf8"));
if (projectConfig.appid !== "wx76e51a2cd77f5bcd") {
  throw new Error(`Unexpected AppID: ${projectConfig.appid}`);
}
if (projectConfig.setting?.es6 !== false) {
  throw new Error("Developer Tools Babel transform must stay disabled for this self-contained demo");
}
const requiredEntryPages = [
  "pages/home/home",
  "pages/index/index",
  "pages/history/history",
  "pages/account/account",
  "pages/project-preview/project-preview",
  "pages/robot-config/robot-config",
  "pages/webview/webview",
  "pages/demo/demo"
];
const missingEntryPages = requiredEntryPages.filter((page) => !appConfig.pages.includes(page));
if (missingEntryPages.length) throw new Error(`Missing entry pages: ${missingEntryPages.join(", ")}`);
if (appConfig.pages[0] !== "pages/demo/demo") throw new Error("Default launch page must be the colorful demo");

const homeAlias = fs.readFileSync(path.join(root, "pages/home/home.js"), "utf8");
const accountAlias = fs.readFileSync(path.join(root, "pages/account/account.js"), "utf8");
if (!homeAlias.includes('/pages/demo/demo')) throw new Error("Home compatibility route is invalid");
if (!accountAlias.includes('/pages/demo/demo?view=profile')) throw new Error("Account compatibility route is invalid");

for (const route of ["index/index", "history/history", "project-preview/project-preview", "robot-config/robot-config", "webview/webview"]) {
  const alias = fs.readFileSync(path.join(root, `pages/${route}.js`), "utf8");
  if (!alias.includes('/pages/demo/demo')) throw new Error(`Compatibility route is invalid: ${route}`);
}

const jsSource = fs.readFileSync(jsPath, "utf8");
if (/\{\s*\[[^\]]+\]\s*:/.test(jsSource)) {
  throw new Error("Computed object properties trigger an unavailable Babel helper in WeChat DevTools");
}
if (jsSource.includes("...")) {
  throw new Error("Object spread triggers an unavailable Babel defineProperty helper in WeChat DevTools");
}
const wxml = fs.readFileSync(wxmlPath, "utf8");
const wxss = fs.readFileSync(wxssPath, "utf8");
const popWxss = fs.readFileSync(popWxssPath, "utf8");
let pageConfig = null;

const wx = new Proxy({}, {
  get() {
    return () => {};
  }
});

vm.runInNewContext(jsSource, {
  Page(config) { pageConfig = config; },
  wx,
  setTimeout,
  clearTimeout,
  console
}, { filename: jsPath });

if (!pageConfig) throw new Error("Page config was not registered");

const handlers = [...wxml.matchAll(/(?:bindtap|catchtap|bindinput|bindchange)="([A-Za-z0-9_]+)"/g)].map((match) => match[1]);
const missingHandlers = [...new Set(handlers)].filter((name) => typeof pageConfig[name] !== "function");
if (missingHandlers.length) throw new Error(`Missing handlers: ${missingHandlers.join(", ")}`);

const checkoutHarness = {
  data: { cartTotalCash: "39.00", checkoutMaxPoints: 1800 },
  setData(next) { Object.assign(this.data, next); }
};
pageConfig.changeCheckoutPoints.call(checkoutHarness, { detail: { value: 1000 } });
if (checkoutHarness.data.checkoutCash !== "47.00") {
  throw new Error(`Checkout points/cash conversion is invalid: ${checkoutHarness.data.checkoutCash}`);
}

if (pageConfig.data.qrCells.length !== 441) {
  throw new Error(`Coupon QR matrix must be 21x21, received ${pageConfig.data.qrCells.length} cells`);
}
if (pageConfig.data.availableCoupons.some((coupon) => coupon.owned)) {
  throw new Error("Available coupon list contains an owned coupon");
}
if (pageConfig.data.ownedCoupons.some((coupon) => !coupon.owned || !coupon.code)) {
  throw new Error("Owned coupon list contains a coupon without ownership or code data");
}
const vehicleHarness = {
  data: { ...pageConfig.data },
  setData(next) { Object.assign(this.data, next); }
};
pageConfig.setVehicleType.call(vehicleHarness, { currentTarget: { dataset: { type: "新能源" } } });
pageConfig.selectVehicleProvince.call(vehicleHarness, { detail: { value: 1 } });
pageConfig.updateVehicleCity.call(vehicleHarness, { detail: { value: "b" } });
pageConfig.updateVehicleNumber.call(vehicleHarness, { detail: { value: "d12-345" } });
if (vehicleHarness.data.vehicleFormPlate !== "京B·D12345" || !vehicleHarness.data.vehicleFormValid || vehicleHarness.data.vehiclePlateSlots.length !== 6) {
  throw new Error(`Vehicle plate form is invalid: ${vehicleHarness.data.vehicleFormPlate}`);
}
if (!pageConfig.data.homeConfig || pageConfig.data.homeConfig.layout.length !== 4) {
  throw new Error("Mall home configuration is missing or incomplete");
}
if (!jsSource.includes('"云庭城市广场"') || !jsSource.includes('"湾岸生活馆"')) {
  throw new Error("Mall-specific home configurations are incomplete");
}
if (!wxml.includes("activity-banner") || !wxml.includes("homeConfig.layout")) {
  throw new Error("Mall activity banner or configurable module order is missing");
}
if (!wxml.includes("homeConfig.commerce.groupBuys") || !wxml.includes("homeConfig.commerce.shopProducts") || !wxml.includes("commerce-mini-card")) {
  throw new Error("Home group-buy and online-shop rails are missing");
}
if ((jsSource.match(/type: "group"/g) || []).length < 15 || (jsSource.match(/type: "shop"/g) || []).length < 18) {
  throw new Error("Mall-specific commerce products are incomplete");
}
if (!wxml.includes("currentView === 'groupBuy'") || !wxml.includes("currentView === 'onlineShop'") || !wxml.includes("currentView === 'commerceProduct'")) {
  throw new Error("Commerce list or product detail views are missing");
}
if (!wxml.includes("waterfall-section") || !jsSource.includes("loadMoreHomeFeed")) {
  throw new Error("Progressive home waterfall is missing");
}
if (!wxml.includes("profile-invite-entry") || !wxml.includes("好友同行计划")) {
  throw new Error("Member invitation activity or profile entry is missing");
}
if (!wxml.includes('currentView === \'activityList\'') || !jsSource.includes("setActivityFilter") || !jsSource.includes("openActivity")) {
  throw new Error("Activity list, filters, or detail navigation is missing");
}
const settingsMarkup = wxml.split("<!-- 设置 -->")[1]?.split("<!-- 页面自定义 -->")[0] || "";
if (!settingsMarkup.includes('data-target="messages"') || !settingsMarkup.includes("消息中心 ›")) {
  throw new Error("Settings notification entry does not navigate to the message center");
}
if (settingsMarkup.includes("pageCustomize") || settingsMarkup.includes("页面自定义")) {
  throw new Error("Page customization entry is still visible in settings");
}
if (!wxml.includes('currentView === \'contentCenter\'') || !wxml.includes('currentView === \'contentDetail\'') || !jsSource.includes("setContentFilter") || !jsSource.includes("openContent")) {
  throw new Error("Content center, content detail, or content navigation is missing");
}
if (!wxml.includes("content-ops-panel") || !wxml.includes("contentOpsMetrics") || !wxml.includes("contentSchedule")) {
  throw new Error("Content operations preview is missing from page customization");
}
if (!wxml.includes('currentView === \'mallCollection\'') || !wxml.includes("mall-showcase-card") || !jsSource.includes("enterMallFromCollection")) {
  throw new Error("Multi-mall collection or mall switching workflow is missing");
}
if (!wxml.includes('currentView === \'merchantManage\'') || !wxml.includes("merchant-workbench") || !jsSource.includes("submitMarketingApply")) {
  throw new Error("Merchant management workflow is missing");
}
if (!wxml.includes("plate-preview-row") || !wxml.includes("selectVehicleProvince") || !jsSource.includes("vehicleFormValid")) {
  throw new Error("Complete vehicle plate entry workflow is missing");
}
if (!wxml.includes("我的积分账户") || !wxml.includes("points-metric-hint")) {
  throw new Error("Points account summary card is incomplete");
}
if (!wxml.includes('wx:if="{{selectedCoupon.owned}}"')) {
  throw new Error("Coupon QR is not protected by the owned-state condition");
}

const targets = [...wxml.matchAll(/data-target="([A-Za-z0-9_]+)"/g)].map((match) => match[1]);
const viewKeys = new Set([
  "home", "mallCollection", "login", "card", "growth", "points", "coupons", "receipt", "receiptResult",
  "search", "guide", "store", "parking", "contentCenter", "contentDetail", "activityList", "activity", "mall", "groupBuy", "onlineShop", "commerceProduct", "profile"
  , "couponDetail", "rewardExchange", "memberProfile", "vehicles", "settings",
  "pageCustomize", "merchantManage", "cart", "checkout", "service", "customerService", "concierge",
  "inviteActivity", "activityPass", "activityRecap", "orders", "messages", "vehicleEdit",
  "customPreview", "orderSuccess", "parkingRecords", "invoice", "infoDetail"
]);
const missingTargets = [...new Set(targets)].filter((target) => !viewKeys.has(target));
if (missingTargets.length) throw new Error(`Unknown targets: ${missingTargets.join(", ")}`);
const missingViewThemes = [...viewKeys].filter((view) => !popWxss.includes(`.theme-pop.view-${view}`));
if (missingViewThemes.length) throw new Error(`Dynamic views missing colorful theme registration: ${missingViewThemes.join(", ")}`);

const compositeFlows = [
  { name: "mall switch sheet", markup: "mallSheetOpen", style: ".theme-pop .bottom-sheet" },
  { name: "exchange confirmation", markup: "exchangeOpen", style: ".theme-pop .confirm-card" },
  { name: "static and dynamic coupon code", markup: "codeMode === '静态码'", style: ".theme-pop .code-panel" },
  { name: "reward points and cash payment", markup: "rewardPayment", style: ".theme-pop .points-slider" },
  { name: "checkout address and payment", markup: "checkoutPayment", style: ".theme-pop .address-card" },
  { name: "complete vehicle plate entry", markup: "plate-preview-row", style: ".theme-pop .plate-preview-cell" }
];
const missingCompositeFlows = compositeFlows.filter(({ markup, style }) => !wxml.includes(markup) || !popWxss.includes(style));
if (missingCompositeFlows.length) {
  throw new Error(`Composite flows missing colorful coverage: ${missingCompositeFlows.map((item) => item.name).join(", ")}`);
}

const sourceBundle = [wxml, wxss, jsSource].join("\n");
if (/K11|K赏|K卡/.test(sourceBundle)) throw new Error("Restricted brand text found");
if (/https?:\/\//.test(sourceBundle)) throw new Error("External URL found in demo source");
if (/#755f00|rgba?\(\s*117\s*,\s*95\s*,\s*0/i.test(`${wxss}\n${popWxss}`)) {
  throw new Error("Legacy dark-gold color leaked into the colorful stylesheet");
}
if (wxml.includes("floor-guide-perspective") || jsSource.includes("floor-guide-perspective")) {
  throw new Error("Legacy dark floor-guide asset is still referenced");
}

const openViews = (wxml.match(/<view(?:\s|>)/g) || []).length;
const closeViews = (wxml.match(/<\/view>/g) || []).length;
if (openViews !== closeViews) throw new Error(`Unbalanced view tags: ${openViews} open, ${closeViews} close`);

const openBlocks = (wxml.match(/<block(?:\s|>)/g) || []).length;
const closeBlocks = (wxml.match(/<\/block>/g) || []).length;
if (openBlocks !== closeBlocks) throw new Error(`Unbalanced block tags: ${openBlocks} open, ${closeBlocks} close`);

const requiredMotionTokens = ["screenEnter", "screenLeave", "tap-press", "button-press", "sheetUp"];
const missingMotion = requiredMotionTokens.filter((token) => !wxss.includes(token));
if (missingMotion.length) throw new Error(`Missing motion tokens: ${missingMotion.join(", ")}`);

if (!wxml.includes("currentView !== 'home' ? 'theme-light theme-inner-soft' : ''")) {
  throw new Error("Colorful theme root is missing");
}
if (!wxss.includes(".theme-pop.theme-inner-soft") || !wxss.includes("--pop-yellow: #e7d3a1")) {
  throw new Error("Soft inner-page color treatment is missing");
}
if (!wxss.includes('@import "./pop-theme.wxss"')) {
  throw new Error("Colorful theme stylesheet is not imported");
}
const requiredPopTokens = [
  "--pop-mint", "--pop-yellow", "--pop-pink", "--pop-blue", "--pop-violet",
  ".theme-pop .pop-home-hero", ".theme-pop .pop-shortcut-grid",
  ".theme-pop .bottom-nav", ".theme-pop .profile-hero",
  ".theme-pop .service-hero", ".theme-pop .search-box"
];
const missingPopTokens = requiredPopTokens.filter((token) => !popWxss.includes(token));
if (missingPopTokens.length) throw new Error(`Missing colorful design tokens: ${missingPopTokens.join(", ")}`);
const bottomItemCount = (wxml.match(/class="bottom-item /g) || []).length;
if (bottomItemCount !== 5) throw new Error(`Bottom navigation must contain 5 items, received ${bottomItemCount}`);
if (!wxml.includes("home-play-zone") || !wxml.includes("8 SERVICES")) throw new Error("Redesigned eight-item home service zone is missing");
if (!wxml.includes('mode="aspectFit"') || !wxml.includes("pop-home-hero-{{homeConfig.bannerTone}}")) {
  throw new Error("Complete activity banner rendering or distinct mall hero variants are missing");
}
const profileGridStart = wxml.indexOf('<view class="profile-service-grid">');
const profileGridEnd = wxml.indexOf('<view class="profile-feature-grid">', profileGridStart);
const profileGridMarkup = profileGridStart >= 0 && profileGridEnd > profileGridStart
  ? wxml.slice(profileGridStart, profileGridEnd)
  : "";
const profileGridItems = (profileGridMarkup.match(/class="tap-target"/g) || []).length;
if (profileGridItems !== 9) throw new Error(`Profile service grid must contain 9 items, received ${profileGridItems}`);
const colorfulIconNames = [
  "points", "coupons", "parking", "service", "activity", "mall", "member-card", "customer-service",
  "orders", "wallet-coupons", "points-record", "messages"
];
for (const iconName of colorfulIconNames) {
  const iconPath = path.join(root, "assets", "icons", "pop", `${iconName}.png`);
  if (!fs.existsSync(iconPath)) throw new Error(`Missing colorful shortcut icon: ${iconName}`);
  if (!wxml.includes(`/assets/icons/pop/${iconName}.png`)) throw new Error(`Colorful shortcut icon is not used: ${iconName}`);
}
const cartoonHomeImages = ["art-festival", "art-bookshop", "mall-guide", "rooftop-music", "family-service", "coffee-lifestyle", "floor-guide-colorful"];
for (const imageName of cartoonHomeImages) {
  const imagePath = path.join(root, "assets", "images", "pop-home", `${imageName}.jpg`);
  if (!fs.existsSync(imagePath)) throw new Error(`Missing cartoon home image: ${imageName}`);
  if (!jsSource.includes(`/assets/images/pop-home/${imageName}.jpg`) && !wxml.includes(`/assets/images/pop-home/${imageName}.jpg`)) {
    throw new Error(`Cartoon home image is not used: ${imageName}`);
  }
}
const requiredMallVisualTokens = [
  'memberPosition: "flow"',
  'layout: ["coupon", "banner", "member", "inspiration"]',
  'layout: ["banner", "member", "inspiration", "coupon"]',
  'layout: ["inspiration", "banner", "coupon", "member"]'
];
const missingMallVisualTokens = requiredMallVisualTokens.filter((token) => !jsSource.includes(token));
if (missingMallVisualTokens.length) throw new Error(`Distinct mall composition tokens missing: ${missingMallVisualTokens.join(", ")}`);
const membershipNames = ["星艺卡", "乐游卡", "潮享卡"];
const missingMembershipNames = membershipNames.filter((name) => !jsSource.includes(`memberName: "${name}"`));
if (missingMembershipNames.length) throw new Error(`Mall-specific membership names missing: ${missingMembershipNames.join(", ")}`);
if (!wxml.includes("homeConfig.memberName") || !wxml.includes("homeConfig.memberRoadmap") || !wxml.includes("member-theme-{{homeConfig.memberTheme}}")) {
  throw new Error("Mall-specific membership typography or growth roadmap is not wired to the UI");
}
if (/金卡会员|铂金卡|黑金卡/.test(`${jsSource}\n${wxml}`)) {
  throw new Error("Legacy universal gold-card membership copy is still visible");
}

console.log(JSON.stringify({
  ok: true,
  handlers: new Set(handlers).size,
  targets: new Set(targets).size,
  views: viewKeys.size,
  compatibleEntryPages: 7,
  externalUrls: 0,
  restrictedBrandMatches: 0
  , appid: projectConfig.appid
  , colorfulTheme: true
  , bottomItems: bottomItemCount
  , colorfulShortcutIcons: colorfulIconNames.length
  , cartoonHomeImages: cartoonHomeImages.length
  , profileGridItems
  , themedViews: viewKeys.size
  , compositeFlows: compositeFlows.length
  , mallMemberships: membershipNames.length
}, null, 2));
