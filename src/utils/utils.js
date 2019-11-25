let class2type = {};
let toString = class2type.toString;
let hasOwn = class2type.hasOwnProperty;
let fnToString = hasOwn.toString;
let getProto = Object.getPrototypeOf;
let ObjectFunctionString = fnToString.call(Object);
import 'babel-polyfill';
if ( !Array.prototype.forEach ) {
    Array.prototype.forEach = function forEach( callback, thisArg ) {
        var T, k;
        if ( this == null ) {
            throw new TypeError( "this is null or not defined" );
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if ( typeof callback !== "function" ) {
            throw new TypeError( callback + " is not a function" );
        }
        if ( arguments.length > 1 ) {
            T = thisArg;
        }
        k = 0;
        while( k < len ) {

            var kValue;
            if ( k in O ) {
                kValue = O[ k ];
                callback.call( T, kValue, k, O );
            }
            k++;
        }
    };
}
NodeList.prototype.forEach = Array.prototype.forEach;
function isFunction(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number";
}

function isWindow(obj) {
    return obj != null && obj === obj.window;
}

function toType(obj) {
    if (obj == null) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[toString.call(obj)] || "object" :
        typeof obj;
}

function isArrayLike(obj) {
    let length = !!obj && "length" in obj && obj.length;
    let type = toType(obj);

    if (isFunction(obj) || isWindow(obj)) {
        return false;
    }

    return type === "array" ||
        length === 0 ||
        typeof length === "number" &&
        length > 0 &&
        (length - 1) in obj;
}

function each(obj, callback) {
    let length;
    let i = 0;

    if (isArrayLike(obj)) {
        length = obj.length;
        for (; i < length; i++) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    } else {
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }
    }
    return obj;
}

function isPlainObject(obj) {
    let proto;
    let Ctor;

    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }

    proto = getProto(obj);

    if (!proto) {
        return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
}

function buildParams(prefix, obj, traditional, add) {
    let name;

    if (Array.isArray(obj)) {

        each(obj, function(i, v) {
            if (traditional || /\[\]$/.test(prefix)) {
                add(prefix, v);
            } else {
                buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, traditional, add);
            }
        });

    } else if (!traditional && toType(obj) === "object") {
        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        }

    } else {
        add(prefix, obj);
    }
}

function param(a, traditional) {
    let prefix;
    let s = [];
    let add = function(key, valueOrFunction) {
        let value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value === null ? "" : value);
    };

    if (Array.isArray(a) || (!isPlainObject(a))) {
        each(a, function() {
            add(this.name, this.value);
        });
    } else {
        for (prefix in a) {
            if (a.hasOwnProperty(prefix)) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }
    }
    return s.join("&");
}

/**
 * 对象属性排序
 * @param dataObj
 */
function objKeySort(dataObj) {
    let key = Object.keys(dataObj).sort();
    let obj = {};
    for (let i = 0; i < key.length; i++) {
        obj[key[i]] = dataObj[key[i]];
    }
    return obj;
}

/**
 * 设置url参数
 * @param url
 * @param arg
 * @param argVal
 * @returns {*}
 */
function setQueryString(url, arg, argVal) {
    let pattern = arg + '=([^&]*)';
    let replaceText = arg + '=' + argVal;
    if (url.match(pattern)) {
        let tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(tmp, replaceText);
        return tmp;
    } else {
        if (url.match('[?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
}
/**
 * 设置url参数
 * @param url
 * @param arg
 * @param argVal
 * @returns {*}
 */
function GetQueryString (name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    let context = "";
    if (r != null)
      context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
  }

/**
 * ajax promise 封装
 * @param opt
 * @returns {Promise<>}
 */
function ajaxPromise(opt) {
    return new Promise(function(resolve, reject) {
        opt = opt || {};
        opt.type = opt.type.toUpperCase() || 'POST';
        opt.url = opt.url || '';
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        opt.contentType = opt.contentType || 'application/x-www-form-urlencoded;charset=utf-8';
        if (!opt.url) {
            return false;
        }
        let xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {
            xmlHttp = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        // xmlHttp.timeout = 10000;
        let postData = param(opt.data); //params.join('&');
        if (opt.type.toUpperCase() === 'POST') {
            xmlHttp.open('POST', opt.url, opt.async);
            xmlHttp.setRequestHeader('Content-Type', opt.contentType);
        } else if (opt.type.toUpperCase() === 'GET') {
            xmlHttp.open('GET', opt.url + '?' + postData, opt.async);
            postData = null;
        }
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                resolve(xmlHttp.responseText);
            }
            xmlHttp.onerror = function(e) {
                reject(e);
            }
        };
        try {
            xmlHttp.send(postData);
        } catch (e) {
            reject(e);
        }
    });
}
/**
 * ajax poat
 * @param [url, data]
 * @returns {Promise<>}
 */
function ajaxPost(url, data) {
    return new Promise(function (resolve, reject) {
        ajaxPromise({
            url: url,
            type: 'post',
            data: data
        }).then(function (res) {
            resolve(JSON.parse(res));
        }).catch(function (e) {
            reject(e);
        });
    });
}
/**
 * ajax get
 * @param [url, data]
 * @returns {Promise<>}
 */
function ajaxGet(url, data) {
    return new Promise(function (resolve, reject) {
        ajaxPromise({
            url: url,
            type: 'get'
        }).then(function (res) {
            resolve(JSON.parse(res));
        }).catch(function (e) {
            reject(e);
        });
    });
}
/**
 * 检查QQ账号
 * @param str
 * @returns {boolean}
 */
function isQQ(str) {
    return RegExp(/^[1-9][0-9]{4,10}$/).test(str);
}

/**
 * 检查微信账号
 * @param str
 * @returns {boolean}
 */
function isWX(str) {
    return RegExp(/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/).test(str);
}

/**
 * 检查手机号
 * @param aPhone
 * @returns {boolean}
 */
function isPhone(aPhone) {
    // return RegExp(/^(0|86|17951)?1[3-9][0-9]{9}$/).test(aPhone);
    return RegExp(/^1[3-9][0-9]{9}$/).test(aPhone);
}

/**
 * 检查邮箱
 * @param aEmail
 * @returns {boolean}
 */
function isEmail(aEmail) {
    return RegExp(/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(aEmail);
}

/**
 * 检查用户名
 * @param str
 * @returns {boolean}
 */
function isUsername(str) {
    return RegExp(/^[a-zA-Z0-9]{1}[a-zA-Z0-9_]{1,18}[a-zA-Z0-9]{1}$/).test(str);
}

/**
 * 检查昵称
 * @param str
 * @returns {boolean}
 */
function isNickname(str) {
    return RegExp(/^[\u4e00-\u9fa5\w_]{1,16}$/).test(str);
}

/**
 * 检查身份证
 * @param str
 * @returns {boolean}
 */
function isIdCard(str) {
    return RegExp(/^[0-9]{15}$|^([0-9]{17}[a-zA-Z0-9]{1})$/).test(str);
}

/**
 * 检查密码
 * @param str
 * @returns {boolean}
 */
function isPassword(str) {
    return RegExp(/^[\w@#*]{6,20}$/).test(str); // 英文、数字、下划线、@、#、*
}

/**
 * 检查密码等级
 * @param str
 * @returns {boolean}
 */
function isSafePassword(str) {
    return RegExp(/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/).test(str);
}


/**
 * 检查电话号
 * @param str
 * @returns {boolean}
 */
function isTel(str) {
    return RegExp(/^[0-9_,\-()\s]{7,20}$/).test(str);
}

/**
 * 检查邮编
 * @param str
 * @returns {boolean}
 */
function isPostCode(str) {
    return RegExp(/^[0-9]{6}$/).test(str);
}

/**
 * 检查数字
 * @param str
 * @returns {boolean}
 */
function isNumber(str) {
    return RegExp(/^[1-9]{1}[0-9]{0,4}$/).test(str);
}

/**
 * 检查账号
 * @param str
 * @returns {boolean}
 */
function isAccount(str) {
    return RegExp(/^1[0-9]{10}$|^106[0-9]{9,12}$/).test(str) ||
        RegExp(/^[a-zA-Z0-9_\-.]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,5}$/).test(str);
}

/**
 * 判断是否为移动端
 * @returns {boolean}
 */
function isMobile() {
    return /iphone|ipod|ipad|ipad|Android|nokia|blackberry|webos|webos|webmate|bada|lg|ucweb|skyfire|sony|ericsson|mot|samsung|sgh|lg|philips|panasonic|alcatel|lenovo|cldc|midp|wap|mobile/i.test(navigator.userAgent.toLowerCase());
}

/**
 * 获取url参数
 */
function getRequest() {
    let url = location.search;
    let theRequest = {};
    if (url.indexOf('?') !== -1) {
        let str = url.substr(1);
        let _str = str.split('&');
        for (let i = 0; i < _str.length; i++) {
            theRequest[_str[i].split('=')[0]] = unescape(_str[i].split('=')[1]);
        }
    }
    return theRequest;
}

/**
 * 获取字符串长度
 * @param sString
 * @returns {number}
 */
function getStrLen(sString) {
    let j = 0;
    if (!sString) return j;
    for (let i = 0; i < sString.length; i++) {
        if (sString.substr(i, 1).charCodeAt(0) > 255) {
            j = j + 2;
        } else {
            j++;
        }
    }
    return j;
}

/**
 * 判断字符串是否包含指定字符串
 * @param str
 * @param substr
 * @returns {boolean}
 */
function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}

/**
 * 获取唯一识别码
 * @returns {*}
 */
function getRandomGuid() {
    function a() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (a() + a() + a() + a() + a() + a() + a() + a());
}

/**
 *
 * @param oldObj
 * @returns {Object|*}
 */
function cloneObj(oldObj) { //复制对象方法
    if (typeof(oldObj) != 'object') return oldObj;
    if (oldObj == null) return oldObj;
    let newObj = {};
    for (let i in oldObj)
        newObj[i] = cloneObj(oldObj[i]);
    return newObj;
}

/**
 *
 * @returns {Object|*}
 */
function extendObj() { //扩展对象
    let args = arguments;
    if (args.length < 2) return;
    let temp = cloneObj(args[0]); //调用复制对象方法
    for (let n = 1; n < args.length; n++) {
        for (let i in args[n]) {
            if (args[n].hasOwnProperty(i)) {
                temp[i] = args[n][i];
            }
        }
    }
    return temp;
}

function getTimestamp() {
    return Math.round(new Date().getTime() / 1000);
}

/**
 *
 * @param str
 * @returns {boolean}
 */
function isJson(str) {
    if (typeof str == 'string') {
        try {
            window.objTemp = JSON.parse(str);
            return true;
        } catch (e) {
            console.log('error：' + str + '!!!' + e);
            return false;
        }
    }
    return false;
}

/**
 * 字符串移除特殊字符
 * @param s
 * @returns {string|string}
 */
function clearString(s) {
    let pattern = new RegExp("[`~!%+-@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？" + '"' + "]");
    let rs = "";
    for (let i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

/**
 * 过滤文件名中的非法字符
 * @param str
 * @returns {*|void|string}
 */
function filterFileName(str) {
    return str && str.replace(/[`~!@#$^&%*\-'",:;()=|{}\\[\]<>/?￥—…‘’“”、，；：。？！【】（）\s+]/g, "")
}

/**
 * 过滤论文标题中的非法字符串
 * @param str
 * @returns {*|void|string}
 */
function filterPaperTitle(str) {
    return str && str.replace(/[`~!@#$^&%*\-'",.:;()=|{}\\[\]<>/?￥—…‘’“”、，；：。？！【】（）\s+]/g, "")
}

/**
 * 过滤论文作者中的非法字符串
 * @param str
 * @returns {*|void|string}
 */
function filterPaperAuthor(str) {
    return str && str.replace(/[`~!@#$^&%*\-'",.:;()=|{}\\[\]<>/?￥—…‘’“”、，；：。？！【】（）\s+]/g, "")
}

/**
 * 字节大小转换
 * @param size
 * @param pointLength
 * @param units
 * @returns {string}
 */
function formatSize(size, pointLength, units) {
    let unit;
    units = units || ['B', 'K', 'M', 'G', 'TB'];
    while ((unit = units.shift()) && size > 1024) {
        size = size / 1024;
    }
    return (unit === 'B' ? size : size.toFixed(pointLength || 2)) + unit;
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formatArr里保持一致
 */
/**
 * 时间戳转化为年 月 日 时 分 秒
 * @param number 传入时间戳
 * @param format 返回格式，支持自定义，但参数必须与formatArr里保持一致
 * @returns {*|void|string}
 */
function formatTimestamp(number, format) {

    var formatArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formatArr[i], returnArr[i]);
    }
    return format;
}

/**
 * 转为数字
 * @param n
 * @returns {string}
 */
function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}

/**
 * 对用户信息进行处理
 * @param userInfo
 * @returns {{ip: *, mobile: *, hasPassword: *, token: *, nowTime: *, lastLoginTime: *, face: *, createTime: *, name: *, nickname: *, vip: (*|Array), account: *, email: *}}
 */
function formatUserInfo(userInfo) {
    return {
        account: userInfo['username'],
        token: userInfo['usertoken'],
        vip: userInfo['vip'] || [],
        mobile: userInfo['bindmobile'],
        email: userInfo['bindemail'],
        nickname: userInfo['nickname'],
        face: userInfo['head_portrait'],
        hasPassword: userInfo['ispwd'],
        nowTime: userInfo['nowtime'],
        ip: userInfo['lastloginip'],
        lastLoginTime: userInfo['lastlogintime'],
        createTime: userInfo['createtime'],
    }
}
function getDataSignString (obj) {
    var datasign = '';
    var jsonObj = null;
    jsonObj = objKeySort(obj);
    for (var item in jsonObj) {
        if (datasign === '') {
            datasign = item + '=' + jsonObj[item]
        } else {
            datasign = datasign + '&' + item + '=' + jsonObj[item]
        }
    }
    datasign += 'hUuPd20171206LuOnD';
    return datasign;
}

export default {
    getRandomGuid,
    isQQ,
    isPhone,
    isEmail,
    isMobile,
    getRequest,
    getStrLen,
    isContains,
    objKeySort,
    setQueryString,
    GetQueryString,
    ajaxPromise,
    ajaxPost,
    ajaxGet,
    extendObj,
    isJson,
    clearString,
    filterFileName,
    filterPaperTitle,
    filterPaperAuthor,
    isWX,
    isUsername,
    isNickname,
    isIdCard,
    isPassword,
    isSafePassword,
    isTel,
    isPostCode,
    isNumber,
    isAccount,
    formatSize,
    isFunction,
    isWindow,
    toType,
    isArrayLike,
    each,
    isPlainObject,
    buildParams,
    param,
    getTimestamp,
    formatTimestamp,
    formatUserInfo,
    getDataSignString
}
