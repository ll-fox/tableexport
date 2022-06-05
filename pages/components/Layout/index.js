import React, { useRef, useState } from 'react'
import Images from 'next/image'
import { Layout, Menu, Breadcrumb, ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
const { Header, Content, Footer } = Layout

const App = (props = {}) => {
  const { children } = props
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
            zIndex: '999'
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
            items={new Array(1).fill(null).map((_, index) => {
              const key = index + 1
              return {
                key,
                label: '出库详情'
              }
            })}
          />
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
