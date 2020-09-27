/*
 * @Author: ruaya
 * @Date: 2020-09-27 10:32:38
 * @LastEditors: ruaya
 * @Description: util function for main.js
 * @FilePath: \time-clock\src\utils.js
 */
function dateDigitToString(num){
    return num < 10 ? '0' + num : num
}

function getCurrentTime(){
    currentDate = new Date()
    var hours = dateDigitToString(currentDate.getHours())
    var minute = dateDigitToString(currentDate.getMinutes())
    var second = dateDigitToString(currentDate.getSeconds())
    var formattedTimeString = hours + ':' + minute + ':' + second
    return formattedTimeString
}

function getCurrentDate(){
    currentDate = new Date()
    var year = dateDigitToString(currentDate.getFullYear())
    var month = dateDigitToString(currentDate.getMonth() + 1) // Date.getMonth()的返回值是0-11,所以要+1
    var date = dateDigitToString(currentDate.getDate())
    var week = currentDate.getDay()
    var formattedDateString = year + '-' + month + '-' + date + '-' + weekday[week]
    return formattedDateString
}

function filterNotification(bundleId, abstract, text) {
    var result1
    var result2
    bundleIdBanList.every(function(item) {
        result1 = bundleId != item
        return result1
    });
    textBanList.every(function(item) {
        result2 = text != item
        return result2
    });
    if (result1 && result2) {
        console.verbose(bundleId)
        console.verbose(abstract)
        console.verbose(text)  
        console.verbose("---------------------------")
    }
    return result1 && result2
}

//保存本地数据
function setStorageData(name, key, value) {
    const storage = storages.create(name)  //创建storage对象
    storage.put(key, value)
}

//读取本地数据
function getStorageData(name, key) {
    const storage = storages.create(name)
    if (storage.contains(key)) {
        return storage.get(key, "")
    }
    //默认返回undefined
}

//删除本地数据
function delStorageData(name, key) {
    const storage = storages.create(name)
    if (storage.contains(key)) {
        storage.remove(key)
    }
}

module.exports = {
    dateDigitToString,
    getCurrentTime,
    getCurrentDate,
    filterNotification,   
    setStorageData,
    getStorageData,
    delStorageData
}