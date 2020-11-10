import TasksPage from './component/TasksPage'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { createTask, editTask, fetchProjects, filterTasks, setCurrentProjectId } from './actions';
import FlashMessage from './component/FlashMessage'
import Header from './component/Header'
import { getGroupedAndFilteredTasks, getProjects } from './reducers'

class APP extends Component {
  onCreateTask = ({ title, description }) => {
    const createAction = createTask({ title, description, projectId: this.props.currentProjectId })
    this.props.dispatch(createAction)
  }

  componentDidMount() {
    //使用了redux-thunk中间件，所以可以使用dispatch派发函数，否则直接派发函数会报错
    //初次进入页面，加载数据
    this.props.dispatch(fetchProjects())
  }

  onStatusChange = (task, status) => {
    //将要修改的状态以status属性的形式传给editTask
    const editAction = editTask(task, { status })
    this.props.dispatch(editAction)
  }

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm))
  }

  onCurrentProjectChange = e => {
    this.props.dispatch(setCurrentProjectId(Number(e.target.value)))
  }

  render() {
    return (
      <div className="container">
        {this.props.error &&
          <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <Header
            projects={this.props.projects}
            onCurrentProjectChange={this.onCurrentProjectChange}
          />
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
  const { isLoading, error } = state.projects //这里的tasks是指task recucer中定义的tasks对象
  //在此处理搜索task的逻辑，已达到store和视图解耦的目的，这就是选择器
  return {
    //state.tasks被传入组件的props
    //getGroupedAndFilteredTasks选择器修改了tasks的数据结构
    tasks: getGroupedAndFilteredTasks(state),
    projects: getProjects(state),
    currentProjectId: state.page.currentProjectId,
    isLoading,
    error
  }
}

export default connect(mapStateToProps)(APP)