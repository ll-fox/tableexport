import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Select, Typography, Divider } from 'antd'
import { exportPDF } from '../../public/static/exportPDF'
import App from '../components/Layout/index'
import style from './index.module.css'


const { Option } = Select
const Template = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)


  useEffect(() => {
    fetchData()
  }, [isModalVisible])


  return (
    <App tab={'template'}>
      <div>
        <div className={style.top}>
          <div>
            <Button type="primary" onClick={()=>exportPDF()}>
              +添加快递
            </Button>
          </div>
        </div>
      </div>
    </App>
  )
}

export default Template
