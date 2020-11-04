import * as api from '../api'
import { CALL_API } from '../middleware/api'

export const FETCH_TASKS_STARTED = 'FETCH_TASKS_STARTED'
export const FETCH_TASKS_SUCCEEDED = 'FETCH_TASKS_SUCCEEDED'
export const FETCH_TASKS_FAILED = 'FETCH_TASKS_FAILED'

export const CREATE_TASK_STARTED = 'CREATE_TASKS_STARTED'
export const CREATE_TASK_SUCCEEDED = 'CREATE_TASK_SUCCEEDED'


let _id = 1
const uniqueId = () => {
    return _id++
}

//函数签名说明需要title和description
// const createTask = ({ title, description }) => {
//     //action创建起返回一个action对象
//     return {
//         type: 'CREATE_TASK',
//         playload: {
//             id: uniqueId(),
//             title,
//             description,
//             status: 'Unstarted'
//         }
//     }
// }

// const createTaskSucceeded = (task) => {
//     return {
//         type: 'CREATE_TASK_SUCCEEDED',
//         playload: {
//             task
//         },
//         //action中的meta一般是用来存放和type和playload无关的数据
//         //这里用来捕获action的数据用来做分析
//         meta: {
//             analytics: {
//                 event: 'create_task',
//                 data: {
//                     id: task.id
//                 }
//             }
//         }
//     }
// }

const createTask = ({ title, description, status = 'Unstarted' }) => {
    return {
        [CALL_API]: {
            types: [CREATE_TASK_STARTED, CREATE_TASK_SUCCEEDED],
            endpoint: '/tasks',
            method: 'post',
            data: {
                title,
                description,
                status
            }
        }
    }
}

// const editTask = (id, param = {}) => {
//     return {
//         type: 'EDIT_TASK',
//         playload: {
//             id,
//             param
//         }
//     }
// }

const editTaskSucceeded = (task, oldTask) => {
    return {
        type: 'EDIT_TASK_SUCCEEDED',
        playload: {
            task
        },
        meta: {
            analytics: {
                event: 'edit_task',
                data: {
                    id: task.id,
                    oldStatus: oldTask.status,
                    newStatus: task.status
                }
            }
        }
    }
}

//params实际上是包含status属性的一个对象
const editTask = (id, params = {}) => {
    return (dispatch, getState) => {
        const task = getTaskById(getState().tasks, id)
        //将新status作为params对象的属性合并到现有task中，并且让api.editTask去更新
        const updateTask = Object.assign({}, task, params)
        api.editTask(id, updateTask)
            .then(resp => {
                dispatch(editTaskSucceeded(resp.data, task))
            })
    }
}

const getTaskById = (tasks, id) => {
    return tasks.tasks.find(task => task.id === id)
}

const fetchTasks = () => {
    //在此返回CALL_API中间件所需要的数据
    return {
        [CALL_API]: {
            types: [FETCH_TASKS_STARTED, FETCH_TASKS_SUCCEEDED, FETCH_TASKS_FAILED],
            endpoint: '/tasks',
            method: 'get'
        }
    }
}

// const fetchTasksSucceeded = (tasks) => {
//     return {
//         type: 'FETCH_TASKS_SUCCEEDED',
//         playload: {
//             tasks
//         }
//     }
// }

// const fetchTasksFailed = (error) => {
//     return {
//         type: 'FETCH_TASKS_FAILED',
//         playload: {
//             error
//         }
//     }
// }

// const fetchTasksStarted = () => {
//     return {
//         type: 'FETCH_TASKS_STARTED'
//     }
// }


// const fetchTasks = () => {
//     return dispatch => {
//         //派发action创建器fetchTasksStarted来表示请求正在进行
//         //加载loading圈
//         dispatch(fetchTasksStarted())
//         api.fetchTask()
//             .then(resp => {
//                 setTimeout(() => {
//                     dispatch(fetchTasksSucceeded(resp.data))
//                 }, 2000)
//                 // throw new Error('Oh noes! Unable to fetch tasks!')
//             }).catch(err => {
//                 dispatch(fetchTasksFailed(err.message))
//             })
//     }
// }

export { uniqueId, createTask, editTask, fetchTasks }
