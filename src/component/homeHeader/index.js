import axios from "axios";
import './index.css';
import { Component } from "react";
import { Link } from 'react-router-dom';
import Avatar from 'antd/lib/avatar/avatar';
import { message, Popover } from 'antd';
import { SearchOutlined } from '@ant-design/icons';



class HomeHeader extends Component{

    constructor() {
        super();
        this.state = {
            newsCol: []
        }
    }

    //获取所有栏目
    getCol() {
        axios({
            url: '/newsfront/columns',
            method: 'get',
            headers: { 'X-Token': sessionStorage.getItem('token') },
            baseURL: 'http://192.168.0.254:8088',
            // baseURL: 'http://127.0.0.1:8088',
        }).then(res => {
            this.setState({
                newsCol: res.data.data
            });
            console.log(this.state.newsCol);
        }).catch(err => {
            console.log(err);
        });
    }

    //退出登录
    loginOut() {
        axios({
            url: '/cus/logout',
            method: 'get',
            headers: { 'X-Token': sessionStorage.getItem('token') },
            baseURL: 'http://192.168.0.254:8088',
        }).then(res => {
            if (res.data.code === 2) {
                message.success('退出成功');
                sessionStorage.removeItem('token');
            }
        })
    }

    componentDidMount() {
        this.getCol();
    }

    //头像下拉卡片
    content = (
        <div className="user_card">
            <p>你好，zt</p>
            {/* eslint-disable-next-line */}
            <a onClick={this.loginOut}>[退出登录]</a>
        </div>
    );



    render(){
        return(
            <header>
            <div className="logo">
                <Link to='/home'><img src="images/logo.png" alt="logo" /></Link>
            </div>
            <nav>
                <ul>
                    {this.state.newsCol && this.state.newsCol.map(item => (
                        <li><Link>{item.columnName}</Link></li>
                    ))}
                </ul>
            </nav>
            {/* !sessionStorage.getItem('token') */ false ? <div className="login">
                <Link to='/login'>立即登录</Link>
            </div> : ''}

            {/* 用户信息显示 */}
            {/* sessionStorage.getItem('token') */ true ? <div className="portrait">
                <Popover content={this.content}>
                    <Avatar size={54} src='images/user_pic.jpg' />
                </Popover>
            </div> : ''}
            <div className="search_bar">
                <input type="text" placeholder='新闻中心' />
                <SearchOutlined className='search_icon' />
            </div>
        </header>
        );
    }
}

export default HomeHeader;