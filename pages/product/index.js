import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Select, Typography, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import App from '../components/Layout/index'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
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
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div
        style={{
          padding: 8
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            重制
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            过滤
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const columns = [
    {
      title: '平台名称',
      dataIndex: 'platform',
      key: 'platform'
    },
    {
      title: '项目名称',
      dataIndex: 'produceName',
      key: 'produceName',
      ...getColumnSearchProps('produceName')
    },
    {
      title: '商品规格名称',
      dataIndex: 'spece',
      key: 'spece'
    },
    {
      title: '供应价格',
      dataIndex: 'price',
      key: 'price',
      sorter: {
        compare: (a, b) => a.price - b.price
        // multiple: 3
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: '审核人',
      dataIndex: 'auditor',
      key: 'auditor',
      ...getColumnSearchProps('auditor')
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