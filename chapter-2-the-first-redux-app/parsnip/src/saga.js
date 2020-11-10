import { take, put, call, takeLatest, delay } from 'redux-saga/effects'
import { channel } from 'redux-saga'
import { fetchTask } from './api'
//这是一个生成器
export default function* rootSaga() {
    //root saga执行的时候，fork会在每个yield语句处暂停，知道副作用完成
    // yield fork(watchFetchTasks)
    yield takeLatest('FETCH_TASKS_STARTED', fetchTasks)
    //为每个TIMER_STARTED类型的action启动一个新的进程
    // yield takeEvery('TIMER_STARTED', handleProgressTimer)

    //初始化takeLatestById辅助函数
    yield takeLatestById(['TIMER_STARTED', 'TIMER_STOPPED'], handleProgressTimer)
}

function* fetchTasks() {
    //while (true) {
    //rootSaga使用了takeLatest, 所以不用再无限循环了，在接受新请求时会取消未完成的旧请求
    // yield take('FETCH_TASKS_STARTED')
    try {
        //call就是调用函数
        const { data } = yield call(fetchTask)
        //put就是派发新的action
        yield put({
            type: 'FETCH_TASKS_SUCCEEDED',
            playload: { tasks: data }
        })
    } catch (e) {
        yield put({
            type: 'FETCH_TASKS_FAILED',
            playload: { error: e.message }
        })
    }
    // }
}

//这就是一个saga
function* handleProgressTimer({ playload, type }) {
    if (type === 'TIMER_STARTED') {
        //每一秒派发一个TIMER_INCREMENT的action
        while (true) {
            yield delay(1000)//delay用于等待1秒钟
            yield put({
                type: 'TIMER_INCREMENT',
                playload: { taskId: playload.taskId }
            })
        }
    }
}

function* takeLatestById(actionType, saga) {
    //存储创建通道的映射
    const channelsMap = {}

    while (true) {
        const action = yield take(actionType)
        const { taskId } = action.playload
        //如果任务中不存在通道，创建一个
        if (!channelsMap[taskId]) {
            channelsMap[taskId] = channel()
            //为任务创建新进程
            yield takeLatest(channelsMap[taskId], saga)
        }
        //派发一个action到特定进程
        //当任务被切换到in progress时候，不会创建新进程
        yield put(channelsMap[taskId], action)
    }
}
