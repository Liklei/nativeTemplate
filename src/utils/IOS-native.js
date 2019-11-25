export const getMobileOs = function () {
    let userAgent = navigator.userAgent || navigator.vendor;
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    return "unknown";
};

export const setupWebViewJavascriptBridge = function (callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(window.WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    let WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0);
};

export const appCall = function (fnName, data, callback, returnValue) {
    if (!fnName) {
        callback && callback();
        return false;
    }
    if (getMobileOs() === 'iOS') {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[fnName]) {
            window.webkit.messageHandlers[fnName].postMessage(data || '');
        } else {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
                    returnValue && returnValue(data)
                    var responseData = { 'js传值':'js传递的值' }
                    log('JS responding with', responseData)
                    responseCallback(responseData)
                });
                
                bridge.callHandler(fnName, data, function (res, responseCallback) {
                    returnValue && returnValue(res, resData, responseCallback);
                    var resData = {};
                    responseCallback(resData);
                });
            });
        }
    }
    if (getMobileOs() === 'Android') {
        if (window.android && window.android[fnName] && window.android[fnName]) {
            window.android[fnName](data || '');
        }
    }
};

export default {
    downloadBase64(data, callback) { // 下载base64
        appCall('fdDownloadBase64', data, () => {
            callback && callback()
        });
    },
    hideTitleBar(callback) { // 隐藏标题
        appCall('fdHideTitleBar', null, () => {
            callback && callback()
        });
    },
    jumpTo(url, callback) { // 跳转至url
        appCall('fdJumpTo', url, () => {
            callback && callback()
        });
    },
    callMe(callback) { // 打电话
        appCall('fdCallMe', '400', () => {
            callback && callback()
        });
    },
    emailMe(callback) { // 发邮件
        appCall('fdEmailMe', 'soft@huduntech.com', () => {
            callback && callback()
        });
    },
    copy(str, callback) { // 复制内容
        appCall('fdCop', str, () => {
            callback && callback()
        });
    },
    openWeChat(callback) { // 打开微信
        appCall('fdOpenWeChat', null, () => {
            callback && callback()
        });
    },
    appNativeUserInfo: function (data) { // 获取用户信息
        if (window.android) {
            return window.android.fdAppNativeUserInfo();
        }
        return '';
    },
    nativeToast(data, callback) { // 原生提示
        appCall('fdNativeToast', data, () => {
            callback && callback()
        });
    },
    onActivityClose(data, callback) { // 关闭页面
        appCall('fdonActivityClose', data, () => {
            callback && callback()
        });
    },
    appDailyPay(data, callback) { //
        appCall('fdAppDailyPay', data, () => {
            callback && callback();
        });
    },
    appRecoverPay(data, callback) { //
        appCall('fdAppRecoverPay', data, () => {
            callback && callback();
        });
    },
    appLogin(data, callback) { // app登录
        appCall('fdAppLogin', data, () => {
            callback && callback();
        });
    },
    goBack(data, callback) { // 返回
        appCall('fdGoback', data, () => {
            callback && callback()
        });
    },
    goHome(data, callback) { // 跳转首页
        appCall('fdGoHome', data, () => {
            callback && callback()
        });
    },
    appNativePay(data, callback) { // 原生支付
        appCall('fdAppNativePay', data, () => {
            callback && callback()
        });
    },
    buriedPoint(data, callback) { // 埋点
        appCall('fdBuriedPoint', data, () => {
            callback && callback()
        });
    },
    countDownTime(data, callback) { // 埋点
        appCall('fdCountDownTime', data, () => {
            callback && callback()
        });
    },
    getIosDownTime(data, callback, getRes) { // 获取ios返回值
        if (getMobileOs() === 'iOS') {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('fdIosDownTime', function(res, responseCallback) {
                    getRes && getRes(res)
                    var responseData = {}
                    responseCallback(responseData)
                });
            });
        }
    },
};
