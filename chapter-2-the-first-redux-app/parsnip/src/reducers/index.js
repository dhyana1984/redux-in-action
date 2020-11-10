import { createSelector } from 'reselect'
import { TASK_STATUES } from '../constants'



const initialTasksState = {
    items: {},
    isLoading: false,
    error: null
}

export const tasks = (state = initialTasksState, action) => {
    switch (action.type) {
        case 'RECEIVE_ENTITIES': {
            const { entities } = action.playload
            if (entities?.tasks) {
                return {
                    ...state,
                    isLoading: false,
                    items: entities.tasks
                }
            }
            return state
        }
        case 'TIMER_INCREMENT': {
            const nextTasks = Object.keys(state.items).map(taskId => {
                const task = state.items[taskId];

                if (task.id === action.playload.taskId) {
                    return { ...task, timer: task.timer + 1 };
                }

                return task;
            })

            return {
                ...state,
                tasks: nextTasks,
            };
        }
        case 'EDIT_TASK_SUCCEEDED':
        case 'CREATE_TASK_SUCCEEDED': {
            const { task } = action.playload
            //添加新的任务对象
            //注意，这里的items是对象
            const nextTasks = {
                ...state.items,
                [task.id]: task //将新的task添加到task recucer state的 items中
            }
            return {
                ...state,
                items: nextTasks
            }
        }
        default:
            return state
    }
}



const initialPrijectsState = {
    items: {},
    isLoading: false,
    error: null,
}

export const projects = (state = initialPrijectsState, action) => {
    switch (action.type) {
        case 'RECEIVE_ENTITIES': {
            const { entities } = action.playload
            if (entities?.projects) {
                return {
                    ...state,
                    isLoading: false,
                    items: entities.projects
                }
            }
            return state
        }
        case 'FETCH_PROJECTS_STARTED': {
            return {
                ...state,
                isLoading: true
            }
        }
        case 'FETCH_PROJECTS_SUCCEEDED': {
            return {
                ...state,
                isLoading: false,
                items: action.playload.projects
            }
        }
        case 'FETCH_TASKS_SUCCEEDED':
            return {
                tasks: action.playload.tasks
            }
        case 'CREATE_TASK_SUCCEEDED': {
            const { task } = action.playload
            const project = state.items[task.projectId]
            //新增task时候添加到对应的project的item的task数组中
            return {
                ...state,
                items: {
                    ...state.items,
                    [task.projectId]: {
                        ...project,
                        tasks: project.tasks.concat(task.id)
                    }
                }
            }
        }
        case 'FETCH_TASKS_STARTED':
            return {
                ...state,
                isLoading: true
            }
        case 'FETCH_TASKS_FAILED':
            return {
                ...state,
                isLoading: false,
                error: action.playload.error
            }
        case 'FILTER_TASKS': {
            return {
                ...state,
                searchTerm: action.playload.searchTerm
            }
        }
        default:
            return state
    }

}

const initialPageState = {
    currentProjectId: null,
    searchTerm: ''
}

export const page = (state = initialPageState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_PROJECT_ID':
            return {
                ...state,
                currentProjectId: action.playload.id
            }
        case 'FILTER_TASKS':
            return { ...state, searchTerm: action.playload.searchTerm };
        default:
            return state
    }
}


//把getFilteredTasks的参数的决定权交给getFilteredTasks自己，而不是外部传进来
const getSearchTerm = state => state.page.searchTerm
const getTaskByProjectId = state => {
    const { currentProjectId } = state.page
    if (!currentProjectId || !state.projects.items[currentProjectId]) {
        return []
    }
    const taskIds = state.projects.items[currentProjectId].tasks
    return taskIds.map(id => state.tasks.items[id])
}



//通用的task filter选择器，选择器和其对应的recuder放在一起
//getFilteredTasks是记忆性选择器，使用createSelector创建
export const getFilteredTasks = createSelector(
    //getTasks, getSearchTerm被称为输入选择器用作其他记忆性选择器的输入
    //getFilteredTasks的state参数会被传入getTasks和getSearchTerm
    [getTaskByProjectId, getSearchTerm],
    (tasks, searchTerm) => tasks.filter(task => task.title.match(new RegExp(searchTerm, "i")))
)

export const getGroupedAndFilteredTasks = createSelector(
    //使用getFilteredTasks的结果作为输入
    [getFilteredTasks],
    tasks => {
        //以每个状态为键构建对象
        const grouped = {}
        TASK_STATUES.forEach(status => {
            grouped[status] = tasks.filter(task => task.status === status)
        })
        return grouped //实际上此时修改了sate的tasks的数据结构，变成了{'Unstarted':[xx,xx], 'In Progress':[xx,xx],'Complete':[xxx,xxx] }
    }
)

export const getProjects = state => {
    return Object.keys(state.projects.items).map(id => {
        return state.projects.items[id]
    })
}
