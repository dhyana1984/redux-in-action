import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux'
import tasks from './reducers'
import { Provider } from 'react-redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import App from './App';

//createStore函数接收3个参数，reducer，初始state和增强器devToolsEnhancer()
//devToolsEnhancer的作用是连接store和Chrome browser
const store = createStore(tasks, devToolsEnhancer())


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


//Create React App脚手架在开发模式下启用模块热替换功能
if (module.hot) {
  module.hot.accept('./App', () => { //每当App组件及其子组件发生变更时，都会重新渲染组件
    const NextApp = require('./App').default
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.getElementById('root')
    )
  })

  //这里是模块热替换reduce，工薪reduce才会触发回调函数，如果是更新action是不会起作用的
  module.hot.accept('./reducers', () => {
    //当reducer更新时执行模块热替换
    const nextRootReducer = require('./reducers').default
    //Redux store提供了replaceReducer方法，可以推动reducer更新
    store.replaceReducer(nextRootReducer)
  })
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
