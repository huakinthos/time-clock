/*
 * @Author: ruaya
 * @Date: 2020-09-25 15:59:06
 * @LastEditors: ruaya
 * @Description: the main process of time-clock.
 * @FilePath: \time-clock\src\main.js
 */
const ACCOUNT = "钉钉账号"
const PASSWORD = "钉钉密码"
const EMAILL_ADDRESS = "用于接收打卡结果的邮箱地址"

const BUNDLE_ID_DD = "com.alibaba.android.rimet"
const BUNDLE_ID_XMSF = "com.xiaomi.xmsf"
const BUNDLE_ID_MAIL = "com.netease.mail"

const NAME_OF_EMAILL_APP = "qq邮箱"
const NAME_OF_ATTENDANCE_MACHINE = "健康打卡" // 活动打卡名称

const LOWER_BOUND = 1 * 60 * 1000       // 最小随机等待时间：1min
const UPPER_BOUND = 5 * 60 * 1000       // 最大随机等待时间：5min

const BUTTON_HOME_POS_X = 540       // Home键坐标x
const BUTTON_HOME_POS_Y = 2278      // Home键坐标y

const BUTTON_DAKA_X = 540       // 打卡按钮坐标x
const BUTTON_DAKA_Y = 1325      // 打卡按钮坐标y

const SCREEN_BRIGHTNESS = 20    // 执行时的屏幕亮度（0-255）

var weekday = new Array(7);
weekday[0] = "Sunday"
weekday[1] = "Monday"
weekday[2] = "Tuesday"
weekday[3] = "Wednesday"
weekday[4] = "Thursday"
weekday[5] = "Friday"
weekday[6] = "Saturday"

var message = ""
var needWaiting = true
var currentDate = new Date()

var bundleIdBanList = [
    "android", 
    "com.xiaomi.aiasst.service",
    "com.xiaomi.simactivate.service", 
    "com.android.mms",
    "com.android.gallery",
    "com.miui.gallery",
    "com.miui.systemui",
    "com.android.providers.downloads",
    "com.android.vending",
]

var textBanList = [
    "无活动的配置文件。",
]

auto.waitFor("normal")          // 检查无障碍权限启动

console.setGlobalLogConfig({
    file: "/sdcard/脚本/Archive/" + getCurrentDate() + "-log.txt"
});

setScreenMetrics(1080, 2340)    // 自动放缩坐标以适配其他设备

events.observeNotification()    // 监听本机通知
events.onNotification(function(notification) {
    printNotification(notification)
});
toastLog("监听中，请在日志中查看记录的通知及其内容")


/**
 * @description 处理通知
 * @param {type} 
 * @return {type} 
 */
function printNotification(notification) {
    var bundleId = notification.getPackageName()    // 获取通知包名
    var abstract = notification.tickerText          // 获取通知摘要
    var text = notification.getText()               // 获取通知文本
    
    if (!filterNotification(bundleId, abstract, text)) { // 筛选通知
        return;
    }
    if (abstract == "定时打卡") { // 监听到摘要为 "定时打卡" 的通知后，执行doClock打卡进程
        needWaiting = true
        doClock()
        return;
    }
    if ((bundleId == BUNDLE_ID_MAIL || bundleId == BUNDLE_ID_XMSF) && text == "打卡") { // 监听到文本为 "打卡" 的通知后，执行doClock打卡进程
        needWaiting = false
        doClock()
        return;
    }
    if ((bundleId == BUNDLE_ID_MAIL || bundleId == BUNDLE_ID_XMSF) && text == "打卡结果") { // 监听到文本为 "打卡结果" 的通知后，以邮件的形式发送最近一次的打卡结果
        message = getStorageData("dingding", "clockResult")
        console.warn(message)
        sendEmail()
        return;
    }
    if (bundleId == BUNDLE_ID_DD && text.indexOf("考勤打卡") >= 0) { // 监听到钉钉返回的考勤结果后，以邮件的形式发送打卡结果
        message = text
        setStorageData("dingding", "clockResult", text)
        console.warn(message)
        sendEmail()
        return;
    }
}


/**
 * @description 打卡主程序 
 * @param {type} 
 * @return {type} 
 */
function doClock() {
    
    console.show()              // 显示控制台
    sleep(100)                  // 等待控制台出现
    console.setSize(800,450)    // 调整控制台尺寸

    currentDate = new Date()
    console.info("当前：" + getCurrentDate() + " " + getCurrentTime()) 
    console.log("开始执行打卡主程序")

    brightScreen()      // 唤醒屏幕
    unlockScreen()      // 解锁屏幕
    stopApp()           // 结束钉钉
    holdOn()            // 随机等待
    signIn()            // 自动登录
    handleUpdata()      // 处理更新
    handleLate()        // 处理迟到
    enterGongzuo()      // 进入工作台
    enterKaoqin()       // 进入打卡界面

    if (currentDate.getHours() <= 12 || currentDate.getDate() <= 4) {
        clockIn()       // 早上和晚上打卡
    }
    else {
        clockOut()      // 中午打卡
    }
    lockScreen()        // 关闭屏幕
    console.hide()      // 关闭控制台
}


/**
 * @description 唤醒设备
 * @param {type} 
 * @return {type} 
 */
function brightScreen() {

    console.info("唤醒设备")
    
    device.setBrightnessMode(0) // 手动亮度模式
    device.setBrightness(SCREEN_BRIGHTNESS)
    device.wakeUpIfNeeded() // 唤醒设备
    device.keepScreenOn()   // 保持亮屏

    console.log("已唤醒")
    
    sleep(1000) // 等待屏幕亮起
    if (!device.isScreenOn()) {
        console.warn("设备未唤醒")
        device.wakeUpIfNeeded()
        brightScreen()
    }
    sleep(1000)
}


/**
 * @description 解锁屏幕
 * @param {type} 
 * @return {type} 
 */
function unlockScreen() {

    console.info("解锁屏幕")
    
    // ? 需要设置密码锁和滑动锁的判断

    gesture(320,[540,device.height * 0.9],[540,device.height * 0.1]) // 上滑解锁
    sleep(1000) // 等待解锁动画完成
    home()
    sleep(1000) // 等待返回动画完成
    
    console.log("已解锁")
}


/**
 * @description 结束钉钉进程
 * @param {type} 
 * @return {type} 
 */
function stopApp() {

    console.info("结束钉钉进程")
    
    app.openAppSetting(BUNDLE_ID_DD)
    let btn_finish = textMatches(/(.*结束.*)|(.*停止.*)|(.*运行.*)/).clickable(true).findOne() // 找到 "结束运行" 按钮，并点击
    if (btn_finish.enabled()) {
        btn_finish.click()

        btn_sure = textMatches("确定").clickable(true).findOne()
        btn_sure.click() // 找到 "确定" 按钮，并点击

        console.log(app.getAppName(BUNDLE_ID_DD) + "已被关闭")
        sleep(1000)
        home()
    } else {
        console.log(app.getAppName(BUNDLE_ID_DD) + "未在运行")
        sleep(1000)
        home()
    }
    sleep(1000)
}


/**
 * @description 随机等待
 * @param {type} 
 * @return {type} 
 */
function holdOn(){
    if (!needWaiting) {
        return;
    }
    var randomTime = random(LOWER_BOUND, UPPER_BOUND)
    toastLog(Math.floor(randomTime / 1000) + "秒后启动" + app.getAppName(BUNDLE_ID_DD) + "...")
    sleep(randomTime)
}


/**
 * @description 启动并登陆钉钉
 * @param {type} 
 * @return {type} 
 */
function signIn() {

    app.launchPackage(BUNDLE_ID_DD)
    console.info("正在启动" + app.getAppName(BUNDLE_ID_DD) + "...")
    
    sleep(10000)    // 等待钉钉启动
    handleUpdata()  // 处理更新弹窗

    if (id("et_pwd_login").exists()) {
        console.log("账号未登录")

        var account = id("et_phone_input").findOne()
        account.setText(ACCOUNT)
        console.log("输入账号")

        var password = id("et_pwd_login").findOne()
        password.setText(PASSWORD)
        console.log("输入密码")
        
        var btn_login = id("btn_next").findOne()
        btn_login.click()
        console.log("正在登陆")
    }
    else {
        if (id("menu_tel").exists()) {
            console.log("账号已登录，当前位于活动页面")
            sleep(1000)
        } 
        else {
            console.warn("未检测到活动页面，重试")
            signIn()
        }
    }
}


/**
 * @description 处理钉钉更新弹窗
 * @param {type} 
 * @return {type} 
 */
function handleUpdata(){

    if (null != textMatches("暂不更新").clickable(true).findOne(3000)) {
        console.info("发现更新弹窗")
        btn_dontUpdate = textMatches(/(.*暂不更新.*)/).findOnce()
        btn_dontUpdate.click()
        console.log("暂不更新")
        sleep(1000)
    }
}


/**
 * @description 处理迟到打卡
 * @param {type} 
 * @return {type} 
 */
function handleLate(){

    if (null != descMatches("迟到打卡").clickable(true).findOne(1000)) {
        console.log("descMatches：迟到打卡")
        desc("迟到打卡").findOne().click()
    }
    if (null != textMatches("迟到打卡").clickable(true).findOne(1000)) {
        console.log("textMatches：迟到打卡")
        text("迟到打卡").findOne().click()
    }
}

// !
/**
 * @description 进入工作台
 * @param {type} 
 * @return {type} 
 */
function enterGongzuo(){
    
    if (null != descMatches("城院钉").clickable(true).findOne(3000)) {
        toastLog("descMatches：城院钉")
        btn_gongzou = descMatches(/(.*工城院.*)/).findOnce()
        btn_gongzou.click()
    }

    console.info("正在进入城院钉...")
    sleep(5000)
    
    if (id("menu_work_info").exists()) {
        console.log("已进入城院钉页面")
        sleep(1000)
    }
}

// !
/**
 * @description 进入打卡界面
 * @param {type} 
 * @return {type} 
 */
function enterKaoqin(){
    if (null != textMatches("健康打卡").clickable(true).findOne(3000)) {
        console.log("textMatches：健康打卡")
        btn_kaoqin = textMatches(/(.*健康打卡.*)/).clickable(true).findOnce() 
        btn_kaoqin.click()
    }
    else {
        attendKaoqin()
    }

    console.info("正在进入健康打卡页面...")
    sleep(6000)
    
    if (null != textMatches("申请").clickable(true).findOne(3000)) {
        console.log("已进入健康打卡页面")
        sleep(1000)
    }
}

// !
/**
 * @description 直接拉起打卡界面（URL Scheme）
 * @param {type} 
 * @return {type} 
 */
function attendKaoqin(){
    var a = app.intent({
        action: "VIEW",
        data: "dingtalk://dingtalkclient/page/link?url=https://attend.dingtalk.com/attend/index.html"
      });
      app.startActivity(a);
      sleep(5000)
}

// !
/**
 * @description 早上晚上打卡 
 * @param {type} 
 * @return {type} 
 */
function clockIn() {

    console.info("上班打卡...")
    
    if (null != textContains("已打卡").findOne(1000)) {
        toastLog("已打卡")
        home()
        sleep(1000)
        return;
    }

    console.log("等待连接到打卡...")
    textContains(NAME_OF_ATTENDANCE_MACHINE).waitFor()
    
    console.log("已连接")
    sleep(1000)

    click(BUTTON_DAKA_X,BUTTON_DAKA_Y)
    sleep(50)
    click(BUTTON_DAKA_X,BUTTON_DAKA_Y)
    sleep(50)
    click(BUTTON_DAKA_X,BUTTON_DAKA_Y)
    console.log("按下打卡按钮")
    sleep(1000)
    
    if (null != textMatches("我知道了").clickable(true).findOne(1000)) {
        text("我知道了").findOne().click()
    }

    sleep(2000);
    
    if (null != textContains("打卡成功").findOne(3000)) {
        toastLog("打卡成功")
    }

    home()
    sleep(1000)
}

// !
/**
 * @description 中午打卡, // !多选项 
 * @param {type} 
 * @return {type} 
 */
function clockOut() {

    console.info("中午打卡...")

    // 进入打卡记录, 查看是否打卡
    if (null != textContains("返校生中午打卡").findOne(1000)) {
        toastLog("已打卡")
        home()
        sleep(1000)
        return;
    }

    console.log("等待连接到打卡服务器...")
    textContains(NAME_OF_ATTENDANCE_MACHINE).waitFor()
    
    console.log("已连接")
    sleep(1000)

    if (null != textMatches("中午打卡").clickable(true).findOne(1000)) {
        textMatches(/(.*中午打卡.*)/).findOnce().click()
        console.log("按下打卡按钮")
        sleep(1000)
    }

    if (null != textMatches("我知道了").clickable(true).findOne(1000)) {
        text("我知道了").findOne().click()
    }

    sleep(2000);
    
    if (null != textContains("打卡成功").findOne(3000)) {
        toastLog("中午打卡成功")
    }

    home()
    sleep(1000)
}


/**
 * @description 锁屏
 * @param {type} 
 * @return {type} 
 */
function lockScreen(){

    console.log("关闭屏幕")

    device.setBrightnessMode(1) // 自动亮度模式
    device.cancelKeepingAwake() // 取消设备常亮
    
    // Power() // 模拟按下电源键，此函数依赖于root权限
    press(BUTTON_HOME_POS_X, BUTTON_HOME_POS_Y, 1000) // 一加的快捷手势：锁屏
}
