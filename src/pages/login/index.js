import "./index.css";
import { Form, Input, Button, message /* notification */ } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { setLoginInfo } from "../../store/action";

function Login(props) {
  const onFinish = (values) => {
    axios({
      url: "/cus/login",
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: `account=${values.account}&password=${values.password}`,
      baseURL: "http://127.0.0.1:8088",
    })
      .then((res) => {
        console.log("登录信息", res.data.data);
        if (res.data.code === 2) {
          props.setLogin(true);
          message.success("登录成功");
          sessionStorage.setItem("token", res.data.data.token);
          sessionStorage.setItem("userPic", res.data.data.user.portrait);
          sessionStorage.setItem("userName", res.data.data.user.account);
          props.history.push("/home");
        } else if (res.data.code === 4) {
          message.error("用户名或者密码错误！");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login_wrapper">
      <div className="login_form">
        <div className="login_inner">
          <div className="login_tit">
            <img src="images/logo.png" alt="" />
            <span>•</span>
            <p style={{ marginTop: "18px" }}>用户名密码登录</p>
          </div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="account"
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
                style={{ height: "40px" }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入密码!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
                style={{ height: "40px" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "320px", height: "40px" }}
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className="forget_pwd">
            {/* eslint-disable-next-line */}
            <a>忘记密码 ？</a>
            <p>
              没有账号 <Link to="/register"> 立即注册 </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { isLogin: state.isLogin };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (isLogin) => dispatch(setLoginInfo(isLogin)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
