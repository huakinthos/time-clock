/* console.show()
sleep(100)
console.setSize(800, 450)
console.info('唤醒设备中')
device.wakeUpIfNeeded() // 唤醒设备
device.keepScreenOn()   // 保持亮屏
console.log('唤醒成功')
if (!device.isScreenOn) {
  console.warn('设备未唤醒')
  device.wakeUpIfNeeded()
  console.log('尝试再次唤醒')
}

console.log('尝试解锁屏幕')

gesture(320, [540, device.height * 0.9], [540, device.height * 0.1]) // 上滑解锁
sleep(1000) // 等待解锁动画完成
home()
sleep(1000) // 等待返回动画完成

console.log("已解锁")

console.log('结束钉钉进程') */
const APP_RUNTIME = 'com.alibaba.android.rimet'
// 打开app 的应用信息
/* app.openAppSetting(APP_RUNTIME)

let btn_finish = textMatches(/(.*结束.*)|(.*停止.*)|(.*运行.*)/).clickable(true).findOne() // 找到 "结束运行" 按钮，并点击
if (btn_finish.enabled()) {
  btn_finish.click()

  btn_sure = textMatches("确定").clickable(true).findOne()
  btn_sure.click() // 找到 "确定" 按钮，并点击

  console.log(app.getAppName(APP_RUNTIME) + "已被关闭")
  sleep(1000)
  home()
} else {
  console.log(app.getAppName(APP_RUNTIME) + "未在运行")
  sleep(1000)
} */
/* toastLog(Math.floor(2000 / 1000) + '秒后开启' + app.getAppName(APP_RUNTIME) + '...')
sleep(1000)

// 启动钉钉

app.launchPackage(APP_RUNTIME)
console.log('正在开启' + app.getAppName(APP_RUNTIME) + ', 请等待10s...')
sleep(3000)

console.log('钉钉开启成功')

if (id("menu_tel").exists()) {
  console.log('钉钉账号已登录, 处于主界面')
} */

function enterDing() {
    btn_ding = descMatches("城院钉").findOnce()
  console.log(btn_ding)
  if (null != descMatches("城院钉").clickable(true).findOne(3000)) {
    toastLog('找到 城院钉 dom了')
    btn_ding = descMatches(/(.*城院钉.*)/).findOnce()
    btn_ding.click()
  }

  console.log('正在进入城院钉...')
  sleep(5000)

  if (id("menu_current_company").exists()) {
    console.log('进入城院钉界面')
    sleep(1000)
  }
}

enterDing()