import axios from 'axios';
import env from './env';

export default async(url = '', data = {}, formData = true, type = 'POST', timeout = 3000) => {
    type = type.toUpperCase();
    url = DOMAIN + url; // 拼接url

    let config = {
        headers: {
            'Accept': 'application/json'
        }
    };
    formData ? config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' : config.headers['Content-Type'] = 'application/json;charset=UTF-8';

    return new Promise((resolve, reject) => {
        axios({
            method: type,
            url: url,
            data: data,
            transformRequest: [function(data) {
                if (!formData) {
                    return JSON.stringify(data);
                }
                let ret = '';
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                }
                return ret;
            }],
            headers: config.headers,
            timeout: timeout
        }).then(function(response) {
            resolve(response);
        }).catch(function(error) {
            reject(error);
        });
    });
};