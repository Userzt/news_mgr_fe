import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import { BackTop, message } from "antd";
//redux
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';
import axios from 'axios';

const store = createStore(reducer);

axios.interceptors.response.use(response => {
  //对响应数据做操作
  if(parseInt(response.data.code, 10) <= '2000000') {
      //console.log('请求成功');
      return response
  }
  if(response.data.code === 4 ) {
      message.success("登录已过期，请重新登录")
      window.location.href = '/login';
      return Promise.reject(response);
  }
  else {
      console.log('请求失败', response.data.code);
      alert(response.data.message);
      return Promise.reject(response);
  }
}, error => {
  //对响应数据错误做操作
  console.log('请求error', error.message);
  return Promise.reject(error);
})

export default axios;

ReactDOM.render(
  <Provider store={store}>
    <BackTop visibilityHeight="600" />
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
