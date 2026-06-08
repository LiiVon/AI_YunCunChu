import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser, registerUser } from '../services/auth';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import SparkMD5 from 'spark-md5';

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  border-radius: var(--border-radius, 16px);

  .ant-card-head-title {
    text-align: center;
    color: var(--text-primary);
    font-size: 24px;
    font-weight: 600;
  }

  .ant-form-item-control-input-content input {
    background: rgba(255, 255, 255, 0.08);
  }

  .ant-btn-primary {
    background: var(--accent-color);
    border-color: var(--accent-color);
    
    &:hover {
      opacity: 0.9;
    }
  }

  .register-link {
    text-align: center;
    margin-top: 16px;
    color: var(--text-secondary);
    cursor: pointer;
    
    &:hover {
      color: var(--accent-color);
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form] = Form.useForm();

  // 添加 MD5 计算函数
  const calculateMD5 = (str) => {
    const spark = new SparkMD5();
    spark.append(str);
    return spark.end();
  };

  const onFinish = async (values) => {
    if (isRegister) {
      // 注册时密码明文传输
      try {
        const data = await registerUser(values);
        if (data.code === 0) {
          message.success('注册成功！请使用新账号登录');
          setIsRegister(false);
          form.setFieldsValue({ username: values.username, password: '' });
        } else if (data.code === 2) {
          message.error('用户名已存在，请重新输入！');
        } else if (data.code === 6) {
          message.error('昵称已存在，请重新输入！');
        }
      } catch (error) {
        message.error('注册失败，请检查网络连接！');
        console.error('注册错误：', error);
      }
    } else {
      // 登录时密码 MD5 加密后传输
      try {
        const encryptedPassword = calculateMD5(values.password);
        const data = await loginUser(values.username, encryptedPassword);
        message.success('登录成功！');
        login({
          username: values.username,
          token: data.token
        });
        navigate('/');
      } catch (error) {
        if (error.message === '登录失败') {
          message.error('用户名或密码错误！');
        } else {
          message.error('登录失败，请检查网络连接！');
        }
        console.error('登录错误：', error);
      }
    }
  };

  return (
    <LoginWrapper>
      <LoginCard title={isRegister ? "用户注册" : "用户登录"}>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          {isRegister && (
            <>
              <Form.Item
                name="nickname"
                rules={[{ required: true, message: '请输入昵称！' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="昵称" 
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱！' },
                  { type: 'email', message: '请输入有效的邮箱地址！' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="邮箱" 
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号码！' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码！' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="手机号码" 
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          {isRegister && (
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码！' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致！'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isRegister ? '注册' : '登录'}
            </Button>
          </Form.Item>
        </Form>
        <div 
          className="register-link" 
          onClick={() => {
            setIsRegister(!isRegister);
            form.resetFields();
          }}
        >
          {isRegister ? '已有账号？点击登录' : '没有账号？点击注册'}
        </div>
      </LoginCard>
    </LoginWrapper>
  );
};

export default Login;