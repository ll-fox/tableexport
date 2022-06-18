import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Select, Typography, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import App from '../components/Layout/index'
import style from './index.module.css'
import ProductModal from '../components/ProductModal'
import { fetchTable, fetchPlatform, addPlatform } from '../api/product'

const { Option } = Select
const Product = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    fetchPlat()
  }, [])

  useEffect(() => {
    fetchData()
  }, [isModalVisible])

  const fetchPlat = () => {
    fetchPlatform().then((res) => {
      res.push({ name: '所有平台' })
      setItems(res)
    })
  }
  const fetchData = (val) => {
    val = val === '所有平台' ? '' : val
    setLoading(true)
    fetchTable(val || '').then((res) => {
      setData(res)
      setLoading(false)
    })
  }

  const columns = [
    {
      title: '平台名称',
      dataIndex: 'platform',
      key: 'platform'
    },
    {
      title: '商品名称',
      dataIndex: 'produceName',
      key: 'produceName'
    },
    {
      title: '商品分类',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '套餐数量',
      dataIndex: 'num',
      key: 'num',
      sorter: {
        compare: (a, b) => a.num - b.num
        // multiple: 3
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      sorter: {
        compare: (a, b) => a.price - b.price
        // multiple: 3
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: '上架状态',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (val, re) => <a onClick={() => showModal(re)}>编辑</a>
    }
  ]

  const showModal = (re) => {
    setItemData(re)
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const addItem = (e) => {
    e.preventDefault()
    if (name) {
      addPlatform(name)
      const obj = {}
      obj['name'] = name
      setItems([...items, obj])
      setName('')
      fetchPlat()
    }
  }

  //   const onChange = (value) => {
  //     fetchData(value)
  //   }

  return (
    <App tab={'product'}>
      <div>
        <div className={style.top}>
          <div>
            选择平台：
            <Select
              style={{
                width: 300
              }}
              onChange={fetchData}
              placeholder="请选择平台名称"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: '8px 0'
                    }}
                  />
                  <Space
                    align="center"
                    style={{
                      padding: '0 8px 4px'
                    }}
                  >
                    <Input
                      placeholder="请输入平台名称"
                      value={name}
                      onChange={onNameChange}
                    />
                    <Typography.Link
                      onClick={addItem}
                      style={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <PlusOutlined /> 添加平台
                    </Typography.Link>
                  </Space>
                </>
              )}
            >
              {items.map((item) => (
                <Option key={item.name}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div>
            <Button type="primary" onClick={() => showModal({})}>
              +发布商品
            </Button>
          </div>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          total={(data || []).length}
          showTotal={(total) => `Total ${total} items`}
          pagination={{
            total: (data || []).length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ y: 'calc(100vh - 320px)' }}
        />
        <ProductModal
          items={items}
          isModalVisible={isModalVisible}
          data={itemData}
          handleCancel={handleCancel}
          handleOk={handleOk}
        />
      </div>
    </App>
  )
}

export default Product
