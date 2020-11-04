import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

export const CALL_API = 'CALL_API'

//使用给定的endpoint构造最终的请求url
const makeCall = (endpoint, method, data = null) => {
    const url = `${API_BASE_URL}${endpoint}`
    const param = {
        method,
        url,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    //axios可以接受一个options的参数，用来设置发送请求的各种参数
    return axios(param)
        .then(resp => resp)
        .catch(err => err)
}

const apiMiddleware = store => next => action => {
    const callApi = action[CALL_API]
    if (typeof callApi === 'undefined') {
        return next(action)
    }
    //解构action中的3种types
    const [requestStartType, successType, failureType] = callApi.types
    //发送requestStartType的action,让loading先转起来
    next({ type: requestStartType })
    //然后请求真正的API
    return makeCall(callApi.endpoint, callApi.method, callApi.data).then(
        //请求成功，发送successType以及返回的数据作为action给reducer
        response =>
            next({
                type: successType,
                playload: response.data
            }),
        //请求失败，发送failureType和error
        error => {
            next({
                type: failureType,
                error: error.message
            })
        }
    )
}




export default apiMiddleware

