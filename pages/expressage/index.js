import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Select, List, Avatar } from 'antd'
import App from '../components/Layout/index'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import style from './index.module.css'
import ExpressageModal from '../components/ExpressageModal'
import { fetchExpressage } from '../api/expressage'

const { Option } = Select
const Expressage = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  useEffect(() => {
    fetchData()
  }, [isModalVisible])

  const fetchData = (val) => {
    val = val === '所有平台' ? '' : val
    setLoading(true)
    fetchExpressage(val || '').then((res) => {
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
      title: '快递公司',
      dataIndex: 'expressage',
      key: 'expressage',
      width: '10%',
      ...getColumnSearchProps('expressage')
    },
    {
      title: '加价区域',
      dataIndex: 'raisePriceArea',
      key: 'raisePriceArea',
      width: '75%',
      render: (val) => (
        <List
          itemLayout="horizontal"
          dataSource={val}
          size={'small'}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '3px 0'
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.yzt-tools.com%2F20190313%2Fff7faa5d6ed43302a2542c2ba4814160.jpg%3Fx-oss-process%3Dimage%2Fresize%2Cw_600%2Fauto-orient%2C1%2Fquality%2Cq_90%2Fformat%2Cjpg&refer=http%3A%2F%2Fimg.yzt-tools.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659373360&t=0512c5164833a470cc622b7d0c975adf" />
                }
                title={
                  <p style={{ fontSize: '9px', margin: '0' }}>
                    加价 <span style={{ color: 'red' }}>{item.price}</span>{' '}
                    元区域
                  </p>
                }
                description={(item.area || []).join(',')}
              />
            </List.Item>
          )}
        />
      )
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: '15%',
      render: (val, re) => <a onClick={() => showModal(re)}>修改</a>
    }
  ]
  const showModal = (re) => {
    setItemData(re)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleFinish = () => {
    setIsModalVisible(false)
    fetchData()
  }

  return (
    <App tab={'expressage'}>
      <div>
        <div className={style.top}>
          <div>
            <Button type="primary" onClick={() => showModal({})}>
              添加快递+
            </Button>
          </div>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            total: (data || []).length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ y: 'calc(100vh - 320px)' }}
        />
        {isModalVisible && (
          <ExpressageModal
            items={items}
            isModalVisible={true}
            data={itemData}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
          />
        )}
      </div>
    </App>
  )
}

export default Expressage
