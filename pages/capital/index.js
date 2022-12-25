import React, { useRef, useState, useEffect } from 'react'
import {
  Table,
  Input,
  Button,
  Space,
  Select,
  Typography,
  Divider,
  Tabs
} from 'antd'
import { exportPDF } from '../../public/static/exportPDF'
import App from '../components/Layout/index'
import ExpressageCapital from './components/ExpressageCapital'
import OutboundCapital from './components/OutboundCapital'

// import style from './index.module.css'

const { TabPane } = Tabs
const { Option } = Select
const Capital = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  //   useEffect(() => {
  //     fetchData()
  //   }, [isModalVisible])

  const onChange = (key) => {
    console.log(key)
  }

  return (
    <App tab={'capital'}>
      <Tabs onChange={onChange} type="card">
        <TabPane tab="快递单号费用" key="1">
          <ExpressageCapital />
        </TabPane>
        <TabPane tab="出库费用" key="4">
          <OutboundCapital />
        </TabPane>
        <TabPane tab="人工费用" key="3">
          人工费用
        </TabPane>
      </Tabs>
    </App>
  )
}

export default Capital
