import React, { Component } from 'react'
import TaskList from './TaskList'

const TASK_STATUES = ['Unstarted', 'In Progress', 'Complete']

//需要处理本地状态时要用ES6类
class TasksPage extends Component {
    renderTaskLists = () => {
        const { tasks } = this.props
        return TASK_STATUES.map(status => {
            const statusTasks = tasks.filter(task => task.status === status)
            return <TaskList key={status} status={status} tasks={statusTasks} />
        })
    }

    render() {
        return (
            <div className="tasks">
                <div className="task-lists">
                    {this.renderTaskLists()}
                </div>
            </div>
        )
    }
}

export default TasksPage