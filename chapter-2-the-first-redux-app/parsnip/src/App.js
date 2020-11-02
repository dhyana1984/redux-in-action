import TasksPage from './component/TasksPage'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { createTask, editTask, fetchTasks } from './actions';

class APP extends Component {
  onCreateTask = ({ title, description }) => {
    const createAction = createTask({ title, description })
    this.props.dispatch(createAction)
  }

  componentDidMount() {
    //使用了redux-thunk中间件，所以可以使用dispatch派发函数，否则直接派发函数会报错
    //初次进入页面，加载数据
    this.props.dispatch(fetchTasks())
  }

  onStatusChange = (id, status) => {
    //将要修改的状态以status属性的形式传给editTask
    const editAction = editTask(id, { status })
    this.props.dispatch(editAction)
  }

  render() {
    return (
      <div className="main-content">
        <TasksPage tasks={this.props.tasks} onCreateTask={this.onCreateTask} onStatusChange={this.onStatusChange} />
      </div>
    )
  }
}

//这里的state就是store的全部内容，通过getState方法可以获得更具体的内容
//props还会被加入一个dispatch函数，用来执行action
const mapStateToProps = (state) => {
  return {
    //state.tasks被传入组件的props
    tasks: state.tasks
  }
}

export default connect(mapStateToProps)(APP)