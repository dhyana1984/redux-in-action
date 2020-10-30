import { uniqueId } from '../actions'

const mockTasks = [
    {
        id: uniqueId(),
        title: 'Learn Redux',
        description: 'The store, actions, and reducers, oh my!',
        status: 'In Progress'
    },
    {
        id: uniqueId(),
        title: 'Peace on Earth',
        description: 'No big deal',
        status: 'In Progress'
    }
]

const tasks = (state = { tasks: mockTasks }, action) => {
    if (action.type === 'CREATE_TASK') {
        return {
            tasks: state.tasks.concat(action.playload)
        }
    } else if (action.type === 'EDIT_TASK') {
        const { playload } = action
        // const result = state.tasks.map(task => {
        //     if (task.id === playload.id) {
        //         const newTask = {
        //             id: task.id,
        //             title: task.title,
        //             description: task.description,
        //             status: playload.param.status
        //         }
        //         return newTask
        //     }
        //     return task
        // })
        // return {
        //     tasks: result
        // }
        const editTask = state.tasks.find(t => t.id === playload.id)
        editTask.status = playload.param.status
        const newTasks = [...state.tasks]
        //一定要返回一个新的对象，指针不指向原来的state，即便是已经修改了原来state的属性
        return {
            tasks: newTasks
        }
    }
    return state
}

export default tasks