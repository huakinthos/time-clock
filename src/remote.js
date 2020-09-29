/*
 * @Author: ruaya
 * @Date: 2020-09-29 19:35:55
 * @LastEditors: ruaya
 * @Description: modify file
 * @FilePath: \time-clock\src\remote.js
 */

/**
 * @description 发邮件主程序
 * @param {type} 
 * @return {type} 
 */
function sendEmail() {

    console.info("开始执行邮件发送主程序")

    brightScreen()      // 唤醒屏幕
    unlockScreen()      // 解锁屏幕

    console.info("正在发送邮件")
    app.sendEmail({
        email: [EMAILL_ADDRESS],
        subject: "考勤结果",
        text: message
    })
    
    waitForActivity("com.android.internal.app.ChooserActivity")
    if (null != textMatches(NAME_OF_EMAILL_APP).findOne(3000)) {
        btn_email = textMatches(NAME_OF_EMAILL_APP).findOnce().parent()
        btn_email.click()
    }
    else {
        console.log("没有找到" + NAME_OF_EMAILL_APP)
        lockScreen()
        return;
    }

    waitForActivity("com.netease.mobimail.activity.MailComposeActivity")
    id("send").findOne().click()

    console.log("已发送")
    message = ""
    
    home()
    sleep(1000)
    lockScreen() // 关闭屏幕
}

module.exports = {
  sendEmail
}