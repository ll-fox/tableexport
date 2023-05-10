import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { signUp, logIn } from '../../api/user'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  // 登录注册
  const signIn = async (values) => {
    if (isLogin) {
      logIn(values.name, values.pwd).then(
        () => {
          router.push('/')
        },
        (error) => {
          alert(JSON.stringify(error))
        }
      )
    } else {
      signUp(values.name, values.pwd).then(
        () => {
          router.push('/')
        },
        (error) => {
          alert(JSON.stringify(error))
        }
      )
    }
  }

  const onFinish = (values) => {
    signIn(values)
  }

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your Username!'
          }
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="pwd"
        rules={[
          {
            required: true,
            message: 'Please input your Password!'
          }
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button
          style={{ width: '100%', backgroundColor: '#c49b45', border: 'none' }}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          {isLogin ? '登陆' : '注册'}
        </Button>
        {/* Or */}
        <span
          style={{
            color: '#1890ff',
            cursor: 'pointer'
          }}
          onClick={() => {
            setIsLogin(!isLogin)
          }}
        >
          {/* {isLogin ? ' register now!' : ' Log in!'} */}
        </span>
      </Form.Item>
    </Form>
  )
}
