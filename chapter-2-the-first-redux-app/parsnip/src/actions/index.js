import * as api from '../api'
import { normalize, schema } from 'normalizr'

const taskSchema = new schema.Entity('tasks')
const projectSchema = new schema.Entity('projects', {
    tasks: [taskSchema]
})

const receiveEntities = (entities) => {
    return {
        type: 'RECEIVE_ENTITIES',
        payload: entities
    }
}

let _id = 1
const uniqueId = () => {
    return _id++
}
const createTaskRequested = () => {
    return {
        type: 'CREATE_TASK_REQUESTED',
    }
}

const createTaskSucceeded = (task) => {
    return {
        type: 'CREATE_TASK_SUCCEEDED',
        payload: {
            task
        }
    }
}

const createTask = ({ title, description, projectId, status = 'Unstarted' }) => {
    return dispatch => {
        api.createTask({ title, description, status, projectId, timer: 0 })
            .then(resp => {
                dispatch(createTaskSucceeded(resp.data))
            })
    }
}

const editTaskSucceeded = (task) => {
    return {
        type: 'EDIT_TASK_SUCCEEDED',
        payload: {
            task
        }
    }
}

//params实际上是包含status属性的一个对象
const editTask = (task, params = {}) => {
    return (dispatch, getState) => {
        //将新status作为params对象的属性合并到现有task中，并且让api.editTask去更新
        const updateTask = {
            ...task,
            ...params
        }
        api.editTask(task.id, updateTask)
            .then(resp => {
                dispatch(editTaskSucceeded(resp.data))
                if (resp.data.status === 'In Progress') {
                    return dispatch(progressTimerStart(resp.data.id))
                } else {
                    return dispatch(progressTimerStop(resp.data.id))
                }
            })
    }
}

const fetchTasksSucceeded = (tasks) => {
    return {
        type: 'FETCH_TASKS_SUCCEEDED',
        payload: {
            tasks
        }
    }
}


const fetchTasks = () => {
    return {
        type: 'FETCH_TASKS_STARTED'
    }
}

const progressTimerStart = (taskId) => {
    return {
        type: 'TIMER_STARTED',
        payload: { taskId }
    }
}

const progressTimerStop = (taskId) => {
    return {
        type: 'TIMER_STOPPED',
        payload: { taskId }
    }
}

const filterTasks = (searchTerm) => {
    return { type: 'FILTER_TASKS', payload: { searchTerm } }
}

const fetchProjectsStarted = (boards) => {
    return {
        type: 'FETCH_PROJECTS_STARTED',
        payload: { boards }
    }
}

const fetchProjectsFailed = (err) => {
    return {
        type: 'FETCH_PROJECTS_FAILED',
        payload: err
    }
}

const fetchProjects = () => {
    return (dispatch, getState) => {
        dispatch(fetchProjectsStarted())

        return api
            .fetchProjects()
            .then(resp => {
                const projects = resp.data
                //将响应和模式传入normalize
                const normalizedData = normalize(projects, [projectSchema])
                //派发规范化数据
                dispatch(receiveEntities(normalizedData))

                if (!getState().page.setCurrentProjectId) {
                    //设置默认项目Id
                    const defaultProjectId = projects[0].id
                    dispatch(setCurrentProjectId(defaultProjectId))
                }
            })
            .catch(err => {
                console.error(err)
                fetchProjectsFailed(err)
            })
    }
}

const setCurrentProjectId = (id) => {
    return {
        type: 'SET_CURRENT_PROJECT_ID',
        payload: { id }
    }
}

export {
    uniqueId,
    createTask,
    editTask,
    fetchTasks,
    fetchTasksSucceeded,
    filterTasks,
    fetchProjects,
    setCurrentProjectId,
    createTaskSucceeded,
    createTaskRequested
}
