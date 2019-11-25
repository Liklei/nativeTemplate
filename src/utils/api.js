import fetch from "./fetch";
import env from './env';
export default {
    createOrder: function(params) {
        return fetch(env.DOMAIN + '/api/v4/payapporder', params)
    },
    queryOrder: function(params) {
        return fetch(env.DOMAIN + '/api/v4/payorderstate', params)
    },
    getUtcTime: function() {
        return fetch(env.DOMAIN + '/api/v4/getutctime')
    },
}