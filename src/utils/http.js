import axios from 'axios'
import { BASE_URL } from '../config/env'
import store from '../store'
import { Message, Notification } from 'element-ui'
import cacheAdapter from './axiosCacheAdapter'

const addAuthorization = config => {
    let { isLogin, token } = store.state.session
    if (isLogin) {
        config.headers.Authorization = token
    }
}

const http = axios.create({
    baseURL: BASE_URL,
    timeout: 10 * 1000,
    adapter: cacheAdapter(axios.defaults.adapter),
})


http.interceptors.request.use(
    config => {
        addAuthorization(config)
        console.log('%c 发起请求 =====>', 'color: #4CAF50; font-weight: bold', config)
        return config
    },
    error => {
        console.log('%c 请求错误 =====>', 'color: #EC6060; font-weight: bold', error)
        return Promise.reject(error)
    });

http.interceptors.response.use(
    response => {
        console.log('%c <===== 收到响应', 'color: #4CAF50; font-weight: bold', response)

        return validateCode(response) ? response.data : Promise.reject({ ...response.data.meta })
    },
    error => {
        console.log('%c <===== 响应错误', 'color: #EC6060; font-weight: bold', error)
        toast('网络异常')
        return Promise.reject(error)
    }
);

function toast(msg, duration = 0) {
    Notification.error({
        title: '错误',
        message: msg,
        duration,
    })
}

/**
 * 
 * 检查请求错误，包括网络错误，服务器错误，后端抛出的错误。收到错误弹出一个提示
 */
function validateCode(res) {
    if (res.data && (res.data.meta.code != 0)) {
        toast(res.data.meta.msg)
        return false
    }
    return true
}

export const fetch = (options) => {
    return http.request(options)
}