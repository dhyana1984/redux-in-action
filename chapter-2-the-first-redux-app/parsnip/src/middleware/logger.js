//const middleware = store => next => action => {} 是redux中间件的标准函数签名
const logger = store => next => action => {
    //样式化console输出
    console.group(action.type)
    console.log('dispatching: ', action)
    //使用next确保action被传递给reducer以及计算下一个状态
    const result = next(action)
    console.log('next state: ', store.getState())
    console.groupEnd(action.type)
    return result
}

export default logger