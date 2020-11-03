// import { uniqueId } from '../actions'

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
    error: null
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
        default:
            break;
    }
    return state
}

export default tasks