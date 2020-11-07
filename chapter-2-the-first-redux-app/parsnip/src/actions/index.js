import * as api from '../api'

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

const createTaskSucceeded = (task) => {
    return {
        type: 'CREATE_TASK_SUCCEEDED',
        playload: {
            task
        }
    }
}

const createTask = ({ title, description, status = 'Unstarted' }) => {
    return dispatch => {
        api.createTask({ title, description, status })
            .then(resp => {
                dispatch(createTaskSucceeded(resp.data))
            })
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

const editTaskSucceeded = (task) => {
    return {
        type: 'EDIT_TASK_SUCCEEDED',
        playload: {
            task
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
                dispatch(editTaskSucceeded(resp.data))
            })
    }
}

const getTaskById = (tasks, id) => {
    return tasks.tasks.find(task => task.id === id)
}

const fetchTasksSucceeded = (tasks) => {
    return {
        type: 'FETCH_TASKS_SUCCEEDED',
        playload: {
            tasks
        }
    }
}

const fetchTasksFailed = (error) => {
    return {
        type: 'FETCH_TASKS_FAILED',
        playload: {
            error
        }
    }
}

const fetchTasksStarted = () => {
    return {
        type: 'FETCH_TASKS_STARTED'
    }
}


const fetchTasks = () => {
    //使用saga替代thunk
    // return dispatch => {
    //     //派发action创建器fetchTasksStarted来表示请求正在进行
    //     //加载loading圈
    //     dispatch(fetchTasksStarted())
    //     api.fetchTask()
    //         .then(resp => {
    //             setTimeout(() => {
    //                 dispatch(fetchTasksSucceeded(resp.data))
    //             }, 2000)
    //             // throw new Error('Oh noes! Unable to fetch tasks!')
    //         }).catch(err => {
    //             dispatch(fetchTasksFailed(err.message))
    //         })
    // }
    return {
        type: 'FETCH_TASKS_STARTED'
    }
}

export { uniqueId, createTask, editTask, fetchTasks, fetchTasksSucceeded }
