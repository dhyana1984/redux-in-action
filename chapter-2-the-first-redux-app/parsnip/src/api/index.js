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

export { fetchTask, createTask, editTask } 