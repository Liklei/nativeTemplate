/**
 * 配置编译环境和线上环境之间的切换
 *
 * DOMAIN: domain [url]
 * DEV: dev [Boolean]
 *
 */


let DOMAIN = ''
const DEV = 'dev'

if (process.env.NODE_ENV == 'development') {
    DOMAIN = '';

} else if (process.env.NODE_ENV == 'production') {
    DOMAIN = ''

}

export default {
    DOMAIN,
    DEV
}