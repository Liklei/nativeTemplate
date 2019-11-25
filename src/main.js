import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import IosNativeTool from './utils/IOS-native'
import AndroidNativeTool from './utils/android-native'


Vue.config.productionTip = true

Vue.prototype.iosNativeTool = IosNativeTool
Vue.prototype.androidNativeTool = AndroidNativeTool


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})