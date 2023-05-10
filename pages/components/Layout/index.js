import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Images from 'next/image'
import Link from 'next/link'
import { Layout, Menu, Select, ConfigProvider, Dropdown, Space } from 'antd'
import {
  DownOutlined,
  UserOutlined,
  BarsOutlined,
  BankOutlined,
  BuildOutlined,
  InsuranceOutlined,
  MoneyCollectOutlined,
  FileProtectOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import MyContext from '../../../lib/context'
import { find } from 'lodash'
import zhCN from 'antd/lib/locale/zh_CN'
import { logOut } from '../../api/user'
const { Header, Content, Footer, Sider } = Layout

const App = (props = {}) => {
  const { children, tab } = props
  const { user, projects, setSelectProject, selectProject } =
    useContext(MyContext)
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
      label: <Link href="/">数据可视化</Link>,
      icon: React.createElement(BarChartOutlined),
      key: 'home'
    },
    {
      label: <Link href="/project">项目管理</Link>,
      icon: React.createElement(BarsOutlined),
      key: 'project'
    },
    {
      label: '进出库',
      key: 'enterBank',
      icon: React.createElement(BankOutlined),
      children: [
        {
          label: <Link href="/package">包装进库</Link>,
          key: 'package'
        },
        {
          label: (
            <Link href="/enterBank/materialStorage">
              <a>商品进库</a>
            </Link>
          ),
          key: 'materialStorage'
        },
        {
          label: (
            <Link href="/enterBank/outStorage">
              <a>商品出库</a>
            </Link>
          ),
          key: 'outStorage'
        }
      ]
    },
    {
      label: '商品管理',
      key: 'productManagement',
      icon: React.createElement(BuildOutlined),
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
      icon: React.createElement(InsuranceOutlined),
      key: 'aftersales'
    },
    // {
    //   label: (
    //     <Link href="/orderForm">
    //       <a>订单管理</a>
    //     </Link>
    //   ),
    //   icon: React.createElement(UserOutlined),
    //   key: 'orderForm'
    // },
    {
      label: (
        <Link href="/capital">
          <a>财务支出</a>
        </Link>
      ),
      icon: React.createElement(MoneyCollectOutlined),
      key: 'capital'
    },
    {
      label: (
        <Link href="/sheet">
          <a>模版</a>
        </Link>
      ),
      icon: React.createElement(FileProtectOutlined),
      key: 'template'
    }
  ]
  const defaultSubMenu = find(menu, { children: [{ key: tab }] })
  const onChange = (value) => {
    setSelectProject(value)
  }
  const onSearch = (value) => {
    console.log('search:', value)
  }
  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ height: '100vh' }}>
        <style jsx>{`
          .site-layout-content {
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
            padding: '0',
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
          <div
            style={{
              padding: '0 30px'
            }}
          >
            <span>项目选择：</span>
            <Select
              showSearch
              style={{
                width: 300
              }}
              defaultValue={selectProject}
              placeholder="请选择项目"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={(projects || []).map((item) => ({
                value: item.objectId,
                label: item.projectName
              }))}
            />
          </div>
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
        <Layout>
          <Sider
            style={{
              height: '100%',
              background: 'rgba(255, 255, 255, 0.2)'
            }}
            width={200}
            collapsible
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={[tab]}
              defaultOpenKeys={[defaultSubMenu?.key]}
              style={{ height: '100%', borderRight: 0 }}
              items={menu}
            />
          </Sider>
          <Content
            style={{
              padding: '20px'
            }}
          >
            <div className="site-layout-content">{children}</div>
          </Content>
          {/* <Footer
          style={{
            padding: '5px 50px',
            textAlign: 'center'
            // width: '100%',
            // position: 'fixed',
            // bottom: 0
          }}
        >
          Table Export ©2022 Created by LIULIN
        </Footer> */}
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
export default App
