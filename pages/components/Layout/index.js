import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Images from 'next/image'
import Link from 'next/link'
import { Layout, Menu, Breadcrumb, ConfigProvider, Dropdown, Space } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import MyContext from '../../lib/context'
import zhCN from 'antd/lib/locale/zh_CN'
import { logOut } from '../../api/user'
const { Header, Content, Footer } = Layout

const App = (props = {}) => {
  const { children } = props
  const { user } = useContext(MyContext)
  const [num, setNum] = useState('1')
  const router = useRouter()
  const menus = (
    <Menu>
      <Menu.Item
        key={2}
        danger={true}
        onClick={() => {
          logOut().then(() => {
            router.push('/login')
          })
        }}
      >
        退出登陆
      </Menu.Item>
    </Menu>
  )
  const menu = [
    {
      label: (
        <Link href="/">
          <a>进库详情</a>
        </Link>
      )
    },
    {
      label: (
        <Link href="/aftersales">
          <a>售后反馈</a>
        </Link>
      )
    }
  ]
  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ height: '100vh' }}>
        <style jsx>{`
          .site-layout-content {
            min-height: 100%;
            padding: 24px;
            background: #fff;
          }
          .logo {
            float: left;
            width: 240px;
            height: 64px;
            display: flex;
            color: #fff;
            font-size: 24px;
            font-weight: STLiti;
            font-weight: 800;
            font-family: cursive;
            margin-right: 15px;
          }
          .ant-row-rtl #components-layout-demo-top .logo {
            float: right;
            margin: 16px 0 16px 24px;
          }
        `}</style>
        <Header
          style={{
            padding: '0 30px',
            position: 'fixed',
            width: '100%',
            zIndex: '999',
            display: 'flex'
          }}
        >
          <div className="logo">
            <span
              style={{
                marginTop: '8px'
              }}
            >
              <Images
                alt="ll"
                width={70}
                height={50}
                src={'/images/logo.png'}
              />
            </span>
            金翁农业系统
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            // selectedKeys={[num]}
            // onClick={(item) => {
            //   console.log(111, item)
            //   // setNum(key)
            // }}
            items={menu.map((item, index) => {
              const key = index + 1
              return {
                key,
                label: item.label
              }
            })}
          />
          <div
            style={{
              position: 'absolute',
              right: '35px'
            }}
          >
            <Dropdown placement="bottom" overlay={menus} arrow>
              <a style={{ color: '#FFF' }} onClick={(e) => e.preventDefault()}>
                <Space>
                  <UserOutlined style={{ fontSize: '20px' }} />
                  {user?.username}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            padding: '0 30px',
            marginTop: '60px'
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0'
            }}
          >
            {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>出库详情</Breadcrumb.Item> */}
          </Breadcrumb>
          <div className="site-layout-content">{children}</div>
        </Content>
        <Footer
          style={{
            textAlign: 'center'
          }}
        >
          Table Export ©2022 Created by LIULIN
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}
export default App
