const analytics = store => next => action => {
    //检查action有没有meta和analytics，没有的话就不用数据分析，直接调用next
    if (!action?.meta?.analytics) {
        return next(action)
    }
    const { event, data } = action.meta.analytics
    fakeAnalyticsApi(event, data)
        .then(resp => {
            console.log('Recorded: ', event, data)
        })
        .catch(err => {
            console.error(
                'An error occurred while sending analytics: ',
                err.toString()
            )
        })
    return next(action)
}

const fakeAnalyticsApi = (eventName, data) => {
    return new Promise((resolve, reject) => {
        resolve('Success!')
    })
}

export default analytics