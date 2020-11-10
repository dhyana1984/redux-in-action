import { createSelector } from 'reselect'
import { TASK_STATUES } from '../constants'

const initialState = {
    items: [],
    isLoading: false,
    error: null,
}

export const projects = (state = initialState, action) => {
    switch (action.type) {
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
        case 'CREATE_TASK':
            return {
                tasks: state.tasks.concat(action.playload)
            }
        case 'EDIT_TASK':
            break
        case 'EDIT_TASK_SUCCEEDED': {
            const { playload } = action
            const nextTasks = state.tasks.map(task => {
                if (task.id === playload.task.id) {
                    return playload.task
                }
                return task
            })

            return {
                ...state,
                tasks: nextTasks
            }
        }
        case 'FETCH_TASKS_SUCCEEDED':
            return {
                tasks: action.playload.tasks
            }
        case 'CREATE_TASK_SUCCEEDED': {
            const { task } = action.playload
            const projectIndex = state.items.findIndex(project => project.id === task.projectId)
            const project = state.items[projectIndex]
            const nextProject = {
                ...project,
                tasks: project.tasks.concat(task)
            }
            return {
                ...state,
                items: [
                    ...state.items.slice(0, projectIndex),
                    nextProject,
                    ...state.items.slice(projectIndex + 1)
                ]
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
        case 'TIMER_INCREMENT': {
            const nextTask = state.tasks.find(task => task.id === action.playload.taskId)
            nextTask.timer += 1
            return {
                ...state,
                tasks: [...state.tasks]
            }
        }
        case 'TIMER_STOPPED':
            return state
        case 'FILTER_TASKS': {
            return {
                ...state,
                searchTerm: action.playload.searchTerm
            }
        }
        default:
            break;
    }
    return state
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
            return {
                ...state,
                searchTerm: action.searchTerm
            }
        default:
            return state
    }
}


//把getFilteredTasks的参数的决定权交给getFilteredTasks自己，而不是外部传进来
const getSearchTerm = state => state.page.tasksSearchTerm
const getTaskByProjectId = state => {
    if (!state.page.currentProjectId) {
        return []
    }
    const currentProject = state.projects.items.find(project => project.id === state.page.currentProjectId)
    return currentProject.tasks
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
