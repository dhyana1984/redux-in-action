// import { uniqueId } from '../actions'
import { createSelector } from 'reselect'
import { TASK_STATUES } from '../constants'
// const mockTasks = [
//     {
//         id: uniqueId(),
//         title: 'Learn Redux',
//         description: 'The store, actions, and reducers, oh my!',
//         status: 'In Progress'
//     },
//     {
//         id: uniqueId(),
//         title: 'Peace on Earth',
//         description: 'No big deal',
//         status: 'In Progress'
//     }
// ]

const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
    searchTerm: ''
}

const tasks = (state = initialState, action) => {
    const { playload } = action
    switch (action.type) {
        case 'CREATE_TASK':
            return {
                tasks: state.tasks.concat(action.playload)
            }
        case 'EDIT_TASK':
            // const editTask = state.tasks.find(t => t.id === playload.id)
            // editTask.status = playload.status
            // const newTasks = [...state.tasks]
            // //一定要返回一个新的对象，指针不指向原来的state，即便是已经修改了原来state的属性
            // return {
            //     tasks: newTasks
            // }
            break
        case 'EDIT_TASK_SUCCEEDED':
            const editTask = state.tasks.find(t => t.id === playload.task.id)
            editTask.status = playload.task.status
            const newTasks = [...state.tasks]
            //一定要返回一个新的对象，指针不指向原来的state，即便是已经修改了原来state的属性
            return {
                ...state,
                tasks: newTasks
            }
        case 'FETCH_TASKS_SUCCEEDED':
            return {
                tasks: action.playload.tasks
            }
        case 'CREATE_TASK_SUCCEEDED':
            return {
                ...state,
                tasks: state.tasks.concat(action.playload.task)
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


//把getFilteredTasks的参数的决定权交给getFilteredTasks自己，而不是外部传进来
const getTasks = state => state.tasks.tasks
const getSearchTerm = state => state.tasks.searchTerm

//通用的task filter选择器，选择器和其对应的recuder放在一起
//getFilteredTasks是记忆性选择器，使用createSelector创建
export const getFilteredTasks = createSelector(
    //getTasks, getSearchTerm被称为输入选择器用作其他记忆性选择器的输入
    //getFilteredTasks的state参数会被传入getTasks和getSearchTerm
    [getTasks, getSearchTerm],
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

export default tasks