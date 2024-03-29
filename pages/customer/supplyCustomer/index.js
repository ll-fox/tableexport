/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState, useEffect, useContext } from 'react'
import { Table, Input, Button, Space, Tooltip, Image, Select } from 'antd'
import moment from 'moment'
import Highlighter from 'react-highlight-words'
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import MyContext from '../../../lib/context'
import App from '../../components/Layout/index'
import { fetchCollectInfo } from '../../api/customer'
import { render } from 'react-dom'
const { Option } = Select

const SupplyCustomer = () => {
  const { selectProject } = useContext(MyContext)
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [loading, setLoading] = useState(false)
  const searchInput = useRef(null)

  useEffect(() => {
    fetchData()
  }, [selectProject])

  const fetchData = () => {
    setLoading(true)
    fetchCollectInfo(selectProject).then((res) => {
			console.log(1111, res)
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            Reset
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
            Filter
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
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      fixed: 'left',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '产品名称',
      dataIndex: 'ProductName',
      width: 150,
      key: 'ProductName',
      render: (val) => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      )
    },
    {
      title: '产品周期',
      dataIndex: 'period',
      key: 'period',
      render: (val) => (val || []).join('至')
    },
    {
      title: '仓库详细地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '打单发货人',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      width: 150,
      render: (val) => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      )
    },
    {
      title: 'material',
      dataIndex: 'material',
      key: 'material',
      ellipsis: true,
      render: (val) => (
        <Image.PreviewGroup>
          {(val || []).map((item, index)=>{
						if(item){
							return (
                <Image
                  key={index}
                  width={50}
                  src={item}
                />
              )
						}
					})}
        </Image.PreviewGroup>
      )
    }
  ]

  return (
    <App tab={'supplyCustomer'}>
      <div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            // total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ y: 'calc(100vh - 320px)', x: '1000' }}
        />
      </div>
    </App>
  )
}

export default SupplyCustomer
