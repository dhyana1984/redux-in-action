let _id = 1
const uniqueId = () => {
    return _id++
}

//函数签名说明需要title和description
const createTask = ({ title, description }) => {
    //action创建起返回一个action对象
    return {
        type: 'CREATE_TASK',
        playload: {
            id: uniqueId(),
            title,
            description,
            status: 'Unstarted'
        }
    }
}

const editTask = (id, param = {}) => {
    return {
        type: 'EDIT_TASK',
        playload: {
            id,
            param
        }
    }
}

export { uniqueId, createTask, editTask }
