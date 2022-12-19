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
import QuotationSheet from './components/QuotationSheet'
import OutboundSheet from './components/OutboundSheet'

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
        <TabPane tab="出库单" key="4">
          <OutboundSheet />
        </TabPane>
        <TabPane tab="金翁农业报价拆分单据" key="1">
          <QuotationSheet />
        </TabPane>
        <TabPane tab="人工费用" key="3">
          人工费用
        </TabPane>
      </Tabs>
    </App>
  )
}

export default Capital
