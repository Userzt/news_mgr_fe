import "./index.css";
import { Component } from "react";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import Avatar from "antd/lib/avatar/avatar";
import { message, Popover } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Footer from "../../component/footer/index";
import { connect } from "react-redux";
import { setLoginInfo } from "../../store/action";
import {formatTime} from "../../utils/formatTime"

class Home extends Component {
  constructor() {
    super();
    this.state = {
      newsData: "",
      newsCol: [],
      currentColIndex: 0,
      isAll: true,
      currentPage: 1,
    };
  }

  //获取所有栏目
  getCol() {
    axios({
      url: "/newsfront/columns",
      method: "get",
      headers: { "X-Token": sessionStorage.getItem("token") },
      baseURL: "http://127.0.0.1:8088",
      // baseURL: 'http://127.0.0.1:8088',
    })
      .then((res) => {
        this.setState({
          newsCol: res.data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //获取新闻
  getData(columnName, page = 1) {
    return axios({
      url: `/newsfront/list?columnName=${columnName}&page=${page}`,
      method: "get",
      headers: { "X-Token": sessionStorage.getItem("token") },
      baseURL: "http://127.0.0.1:8088",
      // baseURL: 'http://127.0.0.1:8088',
    })
      .then((res) => {
        this.setState({
          newsData: res.data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //退出登录
  loginOut() {
    axios({
      url: "/cus/logout",
      method: "get",
      headers: { "X-Token": sessionStorage.getItem("token") },
      baseURL: "http://127.0.0.1:8088",
    }).then((res) => {
      console.log(res);
      if (res.data.code === 2) {
        message.success("退出成功");
        sessionStorage.removeItem("userPic");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userName");
        this.props.setLogin(false);
      } else if (res.data.code === 4) {
        message.warning("登录已过期，请重新登录");
        this.props.history.push("/login");
      }
    });
  }

  componentDidMount() {
    this.getData("");
    this.getCol();
  }

  //头像下拉卡片
  content = (
    <div className="user_card">
      <p>你好，{sessionStorage.getItem("userName")}</p>
      {/* eslint-disable-next-line */}
      <a onClick={() => this.loginOut()}>[退出登录]</a>
    </div>
  );

  whichColNews(index) {
    this.getData(this.state.newsCol[index].columnName);
    sessionStorage.setItem(
      "currentColName",
      this.state.newsCol[index].columnName
    );

    //设置当前处在哪个栏目
    this.setState({
      currentColIndex: index,
      isAll: false,
    });
  }

  isAll() {
    this.getData("");
    sessionStorage.setItem("currentColName", "");
    this.setState({
      isAll: true,
    });
  }


  //获取点击的新闻Id
  getDetails(newsId) {
    sessionStorage.setItem("newsId", newsId);
  }

  //页码改变
  onChangePage = (pageNumber) => {
    console.log(pageNumber);
    this.getData(sessionStorage.getItem("currentColName"), pageNumber);
  };

  render() {
    return (
      <div className="home_wrapper">
        <header>
          <div className="logo">
            <Link to="/home">
              <img src="images/logo.png" alt="logo" />
            </Link>
          </div>
          <nav>
            <ul>
              <li
                key="213213"
                className={this.state.isAll === true ? "active" : ""}
              >
                {/* eslint-disable-next-line */}
                <a onClick={() => this.isAll()}>全部</a>
              </li>
              {this.state.newsCol &&
                this.state.newsCol.map((item, index) => (
                  <li
                    key={index}
                    className={
                      !this.state.isAll && this.state.currentColIndex === index
                        ? "active"
                        : ""
                    }
                  >
                    {/* eslint-disable-next-line */}
                    <a onClick={() => this.whichColNews(index)}>
                      {item.columnName}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
          {!this.props.isLogin ? (
            <div className="login">
              <Link to="/login">立即登录</Link>
            </div>
          ) : (
            ""
          )}

          {/* 用户信息显示 */}
          {this.props.isLogin ? (
            <div className="portrait">
              <Popover content={this.content}>
                <Avatar
                  size={54}
                  src={
                    "http://127.0.0.1:8088/" + sessionStorage.getItem("userPic")
                  }
                />
              </Popover>
            </div>
          ) : (
            ""
          )}
          <div className="search_bar">
            <input type="text" placeholder="新闻中心" />
            <SearchOutlined className="search_icon" />
          </div>
        </header>

        {/* 新闻内容区 */}
        <div className="news_content">
          <div className="news_wrapper">
            <div className="news_tit">
              <h2>热点精选</h2>
            </div>
            <ul>
              {this.state.newsData.list &&
                this.state.newsData.list.map((item) => (
                  <li key={item.newsId}>
                    <Link
                      onClick={() => this.getDetails(item.newsId)}
                      className="news_pic"
                      to="/details"
                    >
                      <img src={"http://127.0.0.1:8088/" + item.pic} alt=" " />
                    </Link>
                    <div className="news_details">
                      <div className="news_title">
                        <Link
                          onClick={() => this.getDetails(item.newsId)}
                          to="/details"
                        >
                          <h3>{item.title}</h3>
                        </Link>
                      </div>
                      <div className="binfo">
                        <div className="f1">
                          <p className="author">{item.author}</p>
                          <p>{formatTime(item.date)}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className="pagination">
            <Pagination
              showQuickJumper
              defaultCurrent={1}
              total={this.state.newsData.total}
              onChange={this.onChangePage}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { isLogin: state.isLogin };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (isLogin) => dispatch(setLoginInfo(isLogin)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
