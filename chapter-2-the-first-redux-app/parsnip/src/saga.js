import { fork, take, put, call, takeLatest } from 'redux-saga/effects'
import { fetchTask } from './api'
//这是一个生成器
export default function* rootSaga() {
    //root saga执行的时候，fork会在每个yield语句处暂停，知道副作用完成
    // yield fork(watchFetchTasks)
    yield takeLatest('FETCH_TASKS_STARTED', fetchTasks)
    yield fork(watchSomethingElse)
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

function* watchSomethingElse() {
    console.log('watching something else!')
}