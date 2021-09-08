import axios from "axios";
import { Component } from "react";
import Avatar from "antd/lib/avatar/avatar";
import {
  LikeOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import HomeHeader from "../../component/homeHeader";
import Footer from "../../component/footer/index";
import "./index.css";
import { connect } from "react-redux";
import { setLoginInfo } from "../../store/action";
import { Input, message } from "antd";
import { formatTime } from "../../utils/formatTime";
const { TextArea } = Input;

class NewsDetail extends Component {
  constructor() {
    super();

    this.state = {
      detailsData: "",
      value: "",
      commentIndex: "",
      replyIndex: "",
      replyValue: "",
    };
  }

  componentDidMount() {
    this.getNewsDetails();
  }

  //获取新闻详情
  getNewsDetails() {
    axios({
      url: "/newsfront/detail",
      params: { newsId: sessionStorage.getItem("newsId") },
      method: "get",
      baseURL: "http://127.0.0.1:8088",
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.code === 2) {
          this.setState({
            detailsData: res.data.data,
          });
        }
        console.log(this.state.detailsData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //评论中登录
  Login = () => {
    this.props.history.push("/login");
  };

  //切换用户
  changeUser = () => {
    this.props.history.push("/login");
  };

  //发布评论
  publish = () => {
    axios({
      url: "/comment/add",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Token": sessionStorage.getItem("token"),
      },
      data: `newsId=${sessionStorage.getItem("newsId")}&text=${
        this.state.value
      }`,
      baseURL: "http://127.0.0.1:8088",
    }).then((res) => {
      if (res.data.code === 2) {
        message.success("评论成功");
        this.setState({
          value: "",
        });
        this.getNewsDetails();
      } else if (res.data.code === 3) {
        message.warning("评论内容不能为空");
      }
    });
    console.log(this.state.value);
  };
  //获取输入的评论
  handleText = (e) => {
    console.log(e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  //获取发表评论的text
  handleReplyText = (e) => {
    this.setState({
      replyValue: e.target.value,
    });
  };
  //点击回复评论
  wantToReplyBtn = (index) => {
    this.setState({
      commentIndex: index,
    });
  };
  //点击收起评论
  closeReplyBox = () => {
    this.setState({
      commentIndex: "",
    });
  };
  //回复评论
  publishComment = (id) => {
    console.log(id);
    axios({
      url: "/comment/reply",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Token": sessionStorage.getItem("token"),
      },
      data: `noteId=${id}&text=${this.state.replyValue}`,
      baseURL: "http://127.0.0.1:8088",
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 2) {
          message.success("回复成功");
          this.setState({
            replyValue: "",
          });
          this.getNewsDetails();
        } else if (res.data.code === 3) {
          message.warning("评论内容不能为空");
        } else if (res.data.code === 4) {
          message.warning("请先登录");
          this.props.history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //点击回复评论中的评论
  wantToReplyToReplyBtn = (index) => {
    this.setState({
      replyIndex: index,
    });
  };
  //点击评论中的收起评论
  closeReplyToReplyBox = () => {
    this.setState({
      replyIndex: "",
    });
  };

  //评论点赞
  giveLike = (id, type) => {
    axios({
      url: "/comment/favor",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Token": sessionStorage.getItem("token"),
      },
      data: `id=${id}&type=${type}`,
      baseURL: "http://127.0.0.1:8088",
    }).then((res) => {
      if (res.data.code === 2) {
        message.success("点赞成功");
        this.getNewsDetails();
      } else if (res.data.code === 4) {
        message.warning("请先登录");
        this.props.history.push("/login");
      }
    });
  };

  //回复点赞
  giveReplyLike = (id) => {
    this.giveLike(id, 2);
  };

  render() {
    //所有评论列表
    let allCommentList =
      this.state.detailsData.notes &&
      this.state.detailsData.notes.map((item, index) => (
        <li key={item.id} id={item.id} className="comment_li">
          <div className="comment_avatar">
            <Avatar
              size={54}
              src={"http://127.0.0.1:8088/" + item.avatar.portrait}
            />
          </div>
          <div className="comment_block">
            <div className="comment_user">
              <span className="comment_username">{item.avatar.account}</span>
              <span className="comment_time">{formatTime(item.date)}</span>
            </div>
            <div className="comment_content">{item.text}</div>
            {/* 所有回复评论列表 */}
            {item.replys.length !== 0 ? (
              <div className="reply">
                <ul>
                  {item.replys &&
                    item.replys.map((item, index) => (
                      <li key={item.id}>
                        <div className="reply_content">
                          <span className="reply_user">
                            <b className="reply_username">
                              {item.avatar.account}
                            </b>{" "}
                            :{" "}
                          </span>
                          {item.text}
                        </div>
                        <div className="reply_operate">
                          <span
                            className="comment_operate_up"
                            onClick={() => this.giveReplyLike(item.id)}
                          >
                            <LikeOutlined style={{ marginRight: "5px" }} />赞{" "}
                            {item.favor}
                          </span>
                          {!(this.state.replyIndex === item.id) ? (
                            <div
                              className="reply_wrapper"
                              style={{ width: "75%" }}
                            >
                              <span
                                className="comment_operate_reply"
                                onClick={() => {
                                  this.wantToReplyToReplyBtn(item.id);
                                }}
                              >
                                <MessageOutlined /> 回复
                              </span>
                            </div>
                          ) : (
                            <div
                              className="reply_wrapper"
                              style={{ width: "80%" }}
                            >
                              <span
                                className="comment_operate_reply"
                                onClick={() => {
                                  this.closeReplyToReplyBox();
                                }}
                              >
                                <MessageOutlined /> 收起
                              </span>
                              <div className="reply_box">
                                <TextArea
                                  value={this.state.replyValue}
                                  className="textarea"
                                  onChange={this.handleReplyText}
                                />
                                <div
                                  className="reply_btn"
                                  onClick={() => {
                                    this.publishComment(item.id);
                                  }}
                                >
                                  回复
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="reply_time">
                            {formatTime(item.date)}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              ""
            )}
            <div className="comment_operate">
              <span
                className="comment_operate_up"
                onClick={() => {
                  this.giveLike(item.id, 1);
                }}
              >
                <LikeOutlined style={{ marginRight: "5px" }} />赞 {item.favor}
              </span>
              {!(this.state.commentIndex === index) ? (
                <div className="reply_wrapper">
                  <span
                    className="comment_operate_reply"
                    onClick={() => {
                      this.wantToReplyBtn(index);
                    }}
                  >
                    <MessageOutlined /> 回复
                  </span>
                </div>
              ) : (
                <div className="reply_wrapper">
                  <span
                    className="comment_operate_reply"
                    onClick={() => {
                      this.closeReplyBox();
                    }}
                  >
                    <MessageOutlined /> 收起
                  </span>
                  <div className="reply_box">
                    <TextArea
                      value={this.state.replyValue}
                      className="textarea"
                      onChange={this.handleReplyText}
                    />
                    <div
                      className="reply_btn"
                      onClick={() => {
                        this.publishComment(item.id);
                      }}
                    >
                      回复
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </li>
      ));

    //
    return (
      <div className="details">
        <HomeHeader props={this.props} />
        <div className="details_wrapper">
          <div className="top_banner"></div>
          <h1>{this.state.detailsData.title}</h1>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: this.state.detailsData.content }}
          ></div>
          <div className="remark">{this.state.detailsData.remark}</div>
          {/* 评论 */}
          <div className="comment">
            <div className="comment_tit">
              <span>网友评论</span>
              <span>
                文明上网理性发言，请遵守
                <a
                  href="https://www.qq.com/coral/coralBeta2/coralinfo.htm"
                  target="_blank"
                  rel="noreferrer"
                >
                  新闻评论服务协议
                </a>
              </span>
              <span>
                {this.state.detailsData.notes &&
                  this.state.detailsData.notes.length}
                条评论
              </span>
            </div>
            {/* 未登录状态下评论 */}
            {!this.props.isLogin ? (
              <div className="comment_logout" style={{ height: "150px" }}>
                <div className="user_pic">
                  <Avatar size={54} icon={<UserOutlined />} src="" />
                </div>
                <div className="comment_content_logout">
                  <div className="box_textarea_logout">
                    <TextArea className="textarea" placeholder="说两句吧..." />
                  </div>
                  <span className="login_btn" onClick={this.Login}>
                    登录
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}

            {/* 已登录状态下评论 */}
            {this.props.isLogin ? (
              <div className="comment_login" style={{ height: "230px" }}>
                <div className="user_pic">
                  <Avatar
                    size={54}
                    src={
                      "http://127.0.0.1:8088/" +
                      sessionStorage.getItem("userPic")
                    }
                  />
                </div>
                <div className="comment_content_login">
                  <div className="box_textarea_login">
                    <TextArea
                      value={this.state.value}
                      className="textarea"
                      placeholder="说两句吧..."
                      onChange={this.handleText}
                    />
                  </div>
                  <div className="box_info">
                    <div className="change_user">
                      <span>{sessionStorage.getItem("userName")}</span>
                      <span onClick={this.changeUser}>切换用户</span>
                    </div>
                    <div className="comment_publish" onClick={this.publish}>
                      发布评论
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* 查看该新闻所有评论 */}
          <div className="comment_show">
            <ul>{allCommentList}</ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail);
