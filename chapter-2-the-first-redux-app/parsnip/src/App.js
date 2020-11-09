import TasksPage from './component/TasksPage'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { createTask, editTask, fetchTasks, filterTasks } from './actions';
import FlashMessage from './component/FlashMessage'
import { getGroupedAndFilteredTasks } from './reducers'

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

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm))
  }

  render() {
    return (
      <div className="container">
        {this.props.error &&
          <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <TasksPage
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onStatusChange={this.onStatusChange}
            isLoading={this.props.isLoading}
            onSearch={this.onSearch}
          />
        </div>
      </div>
    )
  }
}

//这里的state就是store的全部内容，通过getState方法可以获得更具体的内容
//props还会被加入一个dispatch函数，用来执行action
const mapStateToProps = (state) => {
  const { isLoading, error } = state.tasks //这里的tasks是指task recucer中定义的tasks对象
  //在此处理搜索task的逻辑，已达到store和视图解耦的目的，这就是选择器
  return {
    //state.tasks被传入组件的props
    //getGroupedAndFilteredTasks选择器修改了tasks的数据结构
    tasks: getGroupedAndFilteredTasks(state),
    isLoading,
    error
  }
}

export default connect(mapStateToProps)(APP)