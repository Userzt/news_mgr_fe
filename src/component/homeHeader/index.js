import axios from "axios";
import "./index.css";
import { Component } from "react";
import { Link } from "react-router-dom";
import Avatar from "antd/lib/avatar/avatar";
import { message, Popover } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { setLoginInfo } from "../../store/action";
import { connect } from "react-redux";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsCol: [],
      currentColIndex: 0,
      isAll: true,
      newsData: "",
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
  getData(columnName) {
    return axios({
      url: `/newsfront/list?columnName=${columnName}&page=1`,
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
      if (res.data.code === 2) {
        message.success("退出成功");
        //修改redux中的登录状态
        this.props.setLogin(false);
        sessionStorage.removeItem("userPic");
        sessionStorage.removeItem("token");
      } else if (res.data.code === 4) {
        message.warning("登录已过期，请重新登录");
        this.props.props.history.push("/login");
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

  async whichColNews(index) {
    await this.getData(this.state.newsCol[index].columnName);

    //设置当前处在哪个栏目
    this.setState({
      currentColIndex: index,
      isAll: false,
    });
  }

  async isAll() {
    await this.getData("");
    this.setState({
      isAll: true,
    });
  }

  render() {
    return (
      <header>
        <div className="logo">
          <Link to="/home">
            <img src="images/logo.png" alt="logo" />
          </Link>
        </div>
        <nav>
          <ul>
            {/* eslint-disable-next-line */}
            <li
              key="213213"
              className={this.state.isAll === true ? "active" : ""}
            >
              <Link to="/home" /*  onClick={() => (this.isAll())} */>全部</Link>
            </li>
            {this.state.newsCol &&
              this.state.newsCol.map((item, index) => (
                // eslint-disable-next-line
                <li
                  key={index}
                  className={
                    !this.state.isAll && this.state.currentColIndex === index
                      ? "active"
                      : ""
                  }
                >
                  <Link
                    to="/home" /* onClick={() => (this.whichColNews(index))} */
                  >
                    {item.columnName}
                  </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
