import errorImg from '../assets/error_img.png'

/**
 * 
 * img标签错误处理
 */
export function handleImgError(event) {
    event.srcElement.src = errorImg
    return true
}

/**
 * 
 * 缩短一个字符串，将超出限制的字符改成...
 */
export function truncateStr(str, num) {
    return str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str
}

/**
 * 
 * 从查询字符串获得page
 */
export function getPageFromRoute(route) {
    let { query } = route
    return (query && query.page) ? parseInt(query.page) : 1
}