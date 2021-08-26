import './index.css'
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Register(props) {

    const onFinish = (values) => {
        let formData = new FormData();
        formData.set('account', values.account);
        formData.set('password', values.password);
        formData.set('tel', values.tel);
        formData.set('file', values.file.file);

        axios({
            url: '/cus/registe',
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: formData,
            baseURL: 'http://192.168.0.254:8088'
        }).then(res => {
            if (res.data.code === 2) {
                message.success('注册成功');
                props.history.push('/login');
            } else if (res.data.code === 4) {
                message.warning('用户名 '+ values.account + ' 已被注册');
            }
        }).catch(err => {
            console.log(err);
        })
    }

    //手动上传
    const onBeforeUpload = () => {
        // beforeUpload 返回 false 后，手动上传文件。
        return false;
    }


    return (
        <div className='reg_wrapper'>
            <div className="reg_form">
                <div className="reg_tit">
                    <h2>欢迎注册</h2>
                    <p>已有账号？<Link to='/login'>登录</Link></p>
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label='用户名'
                        name="account"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input placeholder='请设置用户名' style={{ height: '40px' }} />
                    </Form.Item>
                    <Form.Item
                        label='手机号'
                        name="tel"
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号!',
                            },
                            {
                                pattern: /^1[3|4|5|7|8][0-9]{9}$/,
                                message: '请输入正确格式的手机号'
                            }

                        ]}
                    >
                        <Input placeholder='可用于登录和找回密码' style={{ height: '40px' }} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label='密码'
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                        ]}
                    >
                        <Input
                            type="password"
                            placeholder="请设置登录密码"
                            style={{ height: '40px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="file"
                        label="头像"
                        height='100'
                    >
                        <Upload listType="picture" beforeUpload={onBeforeUpload}>
                            <Button style={{ height: '40px' }} icon={<UploadOutlined />}>上传头像</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{
                            width: '400px', height: '50px',
                            marginTop: '40px', borderRadius: '50px',
                            opacity: '0.8', fontSize: '17px'
                        }} className="login-form-button">
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="reg_text">
                <h3>用科技</h3>
                <p>让复杂的世界更简单</p>
            </div>
        </div>
    )
}

export default Register;