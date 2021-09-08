import React, { Component } from "react";
import { Link } from "react-router-dom";
import './index.css';





class NewsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newsList: props.newsData,
        }
    }

    //发表时间的过滤器
    formatCreateTime(time) {
        let descTime = new Date().getTime() - new Date(time).getTime();
        if (descTime / 1000 < 30) {
            return '刚刚';
        } else if (descTime / 1000 < 60) {
            return parseInt(descTime / 1000) + '秒前';
        } else if (descTime / 60000 < 60) {
            return parseInt(descTime / 60000) + '分钟前';
        } else if (descTime / 3600000 < 24) {
            return parseInt(descTime / 3600000) + '小时前';
        } else if (descTime / 86400000 < 31) {
            return parseInt(descTime / 86400000) + '天前';
        } else if (descTime / 2592000000 < 12) {
            return parseInt(descTime / 2592000000) + '月前';
        } else {
            return parseInt(descTime / 31536000000) + '年前';
        }
    }

    render() {
        return (
            <div className="news_wrapper">
                <div className="news_tit">
                        <h2>热点精选</h2>
                    </div>
                <ul>
                    {this.props.newsData.list && this.props.newsData.list.map(item => (
                        <li key={item.newsId}>
                            <Link className='news_pic' to='details'><img src={'http://127.0.0.1:8088/' + item.pic} alt=" " /></Link>
                            <div className="news_details">
                                <Link to='/details'><h3>{item.title}</h3></Link>
                                <div className="binfo">
                                    <div className="f1">
                                          <p className='author'>{item.author}</p>
                                          <p>{this.formatCreateTime(item.date)}</p>
                                    </div>                          

                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
export default NewsList;