import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

const fetchTask = () => {
    return client.get('/tasks')
}

const createTask = (params) => {
    return client.post('/tasks', params)
}

const editTask = (id, params) => {
    return axios.put(`${API_BASE_URL}/tasks/${id}`, params)
}

const fetchProjects = () => {
    //在发送响应之前将project的task嵌入每个project的对象中
    //返回的project对象会包含对应的task对象
    return client.get('/projects?_embed=tasks')
}

export { fetchTask, createTask, editTask, fetchProjects } 