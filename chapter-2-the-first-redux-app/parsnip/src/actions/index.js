import * as api from '../api'

let _id = 1
const uniqueId = () => {
    return _id++
}

const createTaskSucceeded = (task) => {
    return {
        type: 'CREATE_TASK_SUCCEEDED',
        playload: {
            task
        }
    }
}

const createTask = ({ title, description, projectId, status = 'Unstarted' }) => {
    return dispatch => {
        api.createTask({ title, description, status, projectId })
            .then(resp => {
                dispatch(createTaskSucceeded(resp.data))
            })
    }
}

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
                if (resp.data.status === 'In Progress') {
                    return dispatch(progressTimerStart(resp.data.id))
                } else {
                    return dispatch(progressTimerStop(resp.data.id))
                }
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


const fetchTasks = () => {
    return {
        type: 'FETCH_TASKS_STARTED'
    }
}

const progressTimerStart = (taskId) => {
    return {
        type: 'TIMER_STARTED',
        playload: { taskId }
    }
}

const progressTimerStop = (taskId) => {
    return {
        type: 'TIMER_STOPPED',
        playload: { taskId }
    }
}

const filterTasks = (searchTerm) => {
    return { type: 'FILTER_TASKS', playload: { searchTerm } }
}

const fetchProjectsStarted = (boards) => {
    return {
        type: 'FETCH_PROJECTS_STARTED',
        playload: { boards }
    }
}

const fetchProjectSucceeded = (projects) => {
    return {
        type: 'FETCH_PROJECTS_SUCCEEDED',
        playload: { projects }
    }
}

const fetchProjectsFailed = (err) => {
    return {
        type: 'FETCH_PROJECTS_FAILED',
        playload: err
    }
}

const fetchProjects = () => {
    return (dispatch, getState) => {
        dispatch(fetchProjectsStarted())

        return api
            .fetchProjects()
            .then(resp => {
                const projects = resp.data
                dispatch(fetchProjectSucceeded(projects))
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
        playload: { id }
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
    setCurrentProjectId
}
