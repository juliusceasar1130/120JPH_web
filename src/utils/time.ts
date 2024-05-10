//封装函数获取时间段
export const getTime = () => {
    let message = ''
    //内置函数
    let hours = new Date().getHours();
    if (hours < 9) {
        message = '早上好'
    } else if (hours < 12) {
        message = '中午好'
    } else if (hours < 18) {
        message = '下午好'
    } else { message = '晚上好' }
    return message;
}