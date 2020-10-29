import react from 'react'
import TasksPage from './component/TasksPage'

const mockTasks = [
  {
    id: 1,
    title: 'Learn Redux',
    description: 'The store, actions, and reducers, oh my!',
    status: 'In Progress'
  }
]

function App() {
  return (
    <div className="main-content">
      <TasksPage tasks={mockTasks} />
    </div>
  );
}

export default App;
