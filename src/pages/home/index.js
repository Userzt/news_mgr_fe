import './index.css'
import { Component } from 'react';
import axios from 'axios';
import { BackTop} from 'antd';
import HomeHeader from '../../component/homeHeader';


class Home extends Component {
    constructor() {
        super();
        this.state = {
            newsData: {},
        }
    }

    //获取所有新闻
    getData() {
        axios({
            url: '/newsfront/list',
            method: 'get',
            headers: { 'X-Token': sessionStorage.getItem('token') },
            baseURL: 'http://192.168.0.254:8088',
            // baseURL: 'http://127.0.0.1:8088',
        }).then(res => {
            this.setState({
                newsData: res.data.data
            });
            console.log(this.state.newsData);
        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <div className='home_wrapper'>
                <BackTop visibilityHeight='600' />
                <HomeHeader />
                <div className="news_content">
              
                </div>
            </div>
        )
    }
}

export default Home;