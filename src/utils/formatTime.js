
// 格式化时间
export function formatTime(time) {
  let descTime = new Date().getTime() - new Date(time).getTime();
  if (descTime / 1000 < 30) {
    return "刚刚";
  } else if (descTime / 1000 < 60) {
    return parseInt(descTime / 1000) + "秒前";
  } else if (descTime / 60000 < 60) {
    return parseInt(descTime / 60000) + "分钟前";
  } else if (descTime / 3600000 < 24) {
    return parseInt(descTime / 3600000) + "小时前";
  } else if (descTime / 86400000 < 31) {
    return parseInt(descTime / 86400000) + "天前";
  } else if (descTime / 2592000000 < 12) {
    return parseInt(descTime / 2592000000) + "月前";
  } else {
    return parseInt(descTime / 31536000000) + "年前";
  }
}
