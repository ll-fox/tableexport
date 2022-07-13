import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Images from 'next/image'
import Link from 'next/link'
import { Layout, Menu, Breadcrumb, ConfigProvider, Dropdown, Space } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import MyContext from '../../../lib/context'
import zhCN from 'antd/lib/locale/zh_CN'
import { logOut } from '../../api/user'
const { Header, Content, Footer } = Layout

const App = (props = {}) => {
  const { children, tab } = props
  const { user } = useContext(MyContext)
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
      label: '进库详情',
      key: 'enterBank',
      children: [
        {
          label: (
            <Link href="/">
              <a>商品进库</a>
            </Link>
          ),
          key: 'home'
        },
        {
          label: (
            <Link href="/enterBank/materialStorage">
              <a>原料进库</a>
            </Link>
          ),
          key: 'materialStorage'
        }
      ]
    },
    {
      label: '商品管理',
      key: 'productManagement',
      children: [
        {
          label: (
            <Link href="/product">
              <a>商品列表</a>
            </Link>
          ),
          key: 'product'
        },
        {
          label: (
            <Link href="/expressage">
              <a>快递管理</a>
            </Link>
          ),
          key: 'expressage'
        }
      ]
    },
    {
      label: (
        <Link href="/aftersales">
          <a>售后反馈</a>
        </Link>
      ),
      key: 'aftersales'
    },
    {
      label: (
        <Link href="/orderForm">
          <a>订单管理</a>
        </Link>
      ),
      key: 'orderForm'
    },
    {
      label: (
        <Link href="/capital">
          <a>财务支出</a>
        </Link>
      ),
      key: 'capital'
    }
    // {
    //   label: (
    //     <Link href="/template">
    //       <a>模版</a>
    //     </Link>
    //   ),
    //   key: 'template'
    // }
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
            width: 190px;
            height: 64px;
            display: flex;
            color: rgba(0, 0, 0, 0.8);
            font-size: 24px;
            font-weight: STLiti;
            font-weight: 800;
            font-family: cursive;
          }
          .ant-row-rtl #components-layout-demo-top .logo {
            float: right;
            margin: 16px 0 16px 24px;
          }
          .ant-menu-horizontal {
            border-bottom: 0;
          }
        `}</style>
        <Header
          style={{
            padding: '0 30px',
            position: 'fixed',
            width: '100%',
            zIndex: '999',
            display: 'flex',
            background: '#ffff'
          }}
        >
          <div className="logo">
            <span>
              <Images
                alt="ll"
                width={182}
                height={64}
                src={'/images/logo.png'}
              />
            </span>
          </div>
          <Menu
            // theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[tab]}
            items={menu}
            style={{ borderBottom: '0' }}
          />
          <div
            style={{
              position: 'absolute',
              right: '35px'
            }}
          >
            <Dropdown placement="bottom" overlay={menus} arrow>
              <a style={{ color: '#000' }} onClick={(e) => e.preventDefault()}>
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
              margin: '10px 0'
            }}
          >
            {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>出库详情</Breadcrumb.Item> */}
          </Breadcrumb>
          <div className="site-layout-content">{children}</div>
        </Content>
        <Footer
          style={{
            padding: '5px 50px',
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
