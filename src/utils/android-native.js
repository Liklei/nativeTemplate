const appCall = function(fnName, data, callback) {
    if (window.webkit && window.webkit.messageHandlers) {
        if (data) {
            window.webkit.messageHandlers[fnName].postMessage(data);
        } else {
            window.webkit.messageHandlers[fnName].postMessage('');
        }
    } else if (window.android && window.android[fnName]) {
        if (data) {
            window.android[fnName](data);
        } else {
            window.android[fnName]();
        }
    } else {
        callback && callback();
    }
};

export default {
    $fdGetUserInfo: function (callback) {
        appCall('fdGetUserInfo', () => {
            callback && callback()
        });
    },
    $fdAppNativePay: function(data, callback) {
        appCall('fdAppNativePay', data, () => {
            callback && callback();
        });
    },

    $fdNativeToast: function(data, callback) {
        appCall('fdNativeToast', data, () => {
            callback && callback();
        });
    },
    $fdonActivityClose: function(callback){
        appCall('onActivityClose', () => {
            callback && callback();
        });
    },
    $fdAppDailyPay: function(data, callback){
        appCall('fdAppDailyPay', data, () => {
            callback && callback();
        });
    },
    $fdAppNativeUserInfo: function(data) {
       let uerInfo = window.android.fdAppNativeUserInfo();
       return uerInfo
    },
    $fdAppLogin: function(data, callback) {
        appCall('fdAppLogin', data, () => {
            callback && callback();
        });
    },
    $fdAppSetStatusBarColor(data, callback) {
        appCall('fdAppSetStatusBarColor', data, () => {
            callback && callback()
        });
    }
 
}