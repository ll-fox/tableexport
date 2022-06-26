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
        <TabPane tab="快递费用" key="1">
          <ExpressageCapital />
        </TabPane>
        <TabPane tab="产品收购费用" key="4">
          产品收购费用
        </TabPane>
        <TabPane tab="人工费用" key="3">
          人工费用
        </TabPane>
      </Tabs>
    </App>
  )
}

export default Capital
