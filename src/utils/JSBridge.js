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
  /**
   * 执行加载WebViewJavascriptBridge_JS.js中代码的作用
   * iframe可以理解为webview中的窗口，当我们改变iframe的src属性的时候，相当于我们浏览器实现了链接的跳转。比如从www.baidu.com跳转到www.  google.com。目的就是实现一个到wvjbscheme://__BRIDGE_LOADED__的跳转, 从而达到初始化javascript环境的bridge的作用。
   */
  let WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'; // 固定常量
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0);
};

//web端调用一个注册的消息
export const appCall = function (fnName, data, callback, returnValue) {
  if (!fnName) {
      callback && callback();
      return false;
  }
  if (getMobileOs() === 'iOS') { // iOS使用
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[fnName]) {
          window.webkit.messageHandlers[fnName].postMessage(data || '');
      } else {
          setupWebViewJavascriptBridge(function (bridge) {
              //注册原生调起方法(把WEB中要注册的方法注册到bridge里面)
              //参数1：testJavascriptHandler 注册flag 供原生使用，要和原生统一
              //参数2：data  是原生传给js 的数据
              //参数3：responseCallback 是js 的回调，可以通过该方法给原生传数据
              bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
                  returnValue && returnValue(data)
                  var responseData = { 'js传值': 'js传递的值' }
                  log('JS responding with', responseData)
                  responseCallback(responseData)
              });

              //js 调用原生方法
              //参数1： 注册flag 供原生使用，要和原生统一
              //参数2： 是调起原生时向原生传递的参数
              //参数3： 原生调用回调返回的数据
              bridge.callHandler(fnName, data, function (res, responseCallback) {
                  returnValue && returnValue(res, resData, responseCallback);
                  var resData = {};
                  responseCallback(resData);
              });
          });
      }
  }
  if (getMobileOs() === 'Android') { // Android使用
      if (window.android && window.android[fnName] && window.android[fnName]) {
        window.android[fnName](data || '');
      }
  }
};

export default {
  downloadBase64(data, callback) { // exp: 下载base64
    appCall('fdDownloadBase64', data, () => {
      callback && callback()
    });
  }
};

/**
 * 总结：
 * 1、分别在OC环境和javascript环境都保存一个bridge对象，里面维持着requestId,callbackId,以及每个id对应的具体实现。
 * 2、OC通过javascript环境的window.WebViewJavascriptBridge对象来找到具体的方法，然后执行。
 * 3、javascript通过改变iframe的src来出发webview的代理方法从而实现把javascript消息发送给OC这个功能
 */