import React, { useRef, useState, useEffect, useContext } from 'react'
import {
  Table,
  Input,
  Button,
  Space,
  Select,
  Typography,
  Divider,
  Tag,
  Image,
  Tooltip,
  Avatar
} from 'antd'
import {
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import { find } from 'loadsh'
import MyContext from '../../../lib/context'
import App from '../../components/Layout/index'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import style from './index.module.css'
import OutStorageModal from '../components/OutStorageModal'
import {
  fetchOutStorage,
} from '../../api/outStorage'
import { fetchProduct, fetchPlatform } from '../../api/product'

const { Option } = Select
const OutStorage = () => {
  const { selectProject } = useContext(MyContext)
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [productList, setProductList] = useState([])
  const [name, setName] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  useEffect(() => {
    fetchPlat()
  }, [selectProject])

  const fetchPlat = () => {
    setLoading(true)
    fetchPlatform().then((res) => {
      res.push({ name: '所有供应商' })
      setItems(res)
      fetchData()
      fetchProduct('', selectProject).then((res) => {
        setProductList(res)
        setLoading(false)
      })
    })
  }
  const fetchData = (val) => {
    setLoading(true)
    val = val === '所有供应商' ? '' : val
    fetchOutStorage(val, selectProject).then((res) => {
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
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      fixed: 'left',
      sorter: {
        compare: (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        // multiple: 3
      }
    },
    {
      title: '平台(客户)名称',
      dataIndex: 'platform',
      key: 'platform',
      width: 130,
      render: (val, re) => val || re.customerName
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      width: 130,
      key: 'channel'
    },
    {
      title: '出库重量（斤）',
      dataIndex: 'weight',
      key: 'weight',
      width: 110,
      sorter: {
        compare: (a, b) => a.weight - b.weight
        // multiple: 3
      },
      sortDirections: ['descend', 'ascend']
    },
    // {
    //   title: '单价',
    //   dataIndex: 'unitPrice',
    //   width: 100,
    //   key: 'unitPrice'
    // },
    {
      title: '金额',
      dataIndex: 'price',
      width: 100,
      sorter: {
        compare: (a, b) => a.price - b.price
        // multiple: 3
      },
      key: 'price'
    },
    {
      title: '出库审核人',
      dataIndex: 'auditor',
      key: 'auditor',
      width: 100,
      ...getColumnSearchProps('auditor')
    },
    {
      title: '是否付款',
      dataIndex: 'pay',
      key: 'pay',
      width: 110,
      render: (val) => (
        <Tag
          icon={
            val === '是' ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
          color={val === '是' ? '#55acee' : '#cd201f'}
        >
          {val}
        </Tag>
      )
    },
    {
      title: '付款审核人',
      dataIndex: 'payAuditor',
      key: 'payAuditor',
      width: 100
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
      title: '证明材料',
      dataIndex: 'material',
      key: 'material',
      ellipsis: true,
      width: 100,
      render: (val) =>
        (val || []).map(
          (item, index) =>
            (
              <a target="_blank" key={index} href={item} rel="noreferrer">
                {item}
              </a>
            ) || '暂无'
        )
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      key: 'x',
      width: 100,
      render: (val, re) => <a onClick={() => showModal(re)}>编辑</a>
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

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const addItem = (e) => {
    e.preventDefault()
    if (name) {
      fetchPlatform().then(() => {
        const obj = {}
        obj['name'] = name
        setItems([...items, obj])
        setName('')
        fetchPlat()
      })
    }
  }

  return (
    <App tab={'outStorage'}>
      <div>
        <div className={style.top}>
          {/* <div>
            供应商：
            <Select
              style={{
                width: 300
              }}
              onChange={fetchData}
              placeholder="请选择供应商名称"
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
                      placeholder="请输入供应商名称"
                      value={name}
                      onChange={onNameChange}
                    />
                    <Typography.Link
                      onClick={addItem}
                      style={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <PlusOutlined /> 添加供应商
                    </Typography.Link>
                  </Space>
                </>
              )}
            >
              {items.map((item) => (
                <Option key={item.name}>{item.name}</Option>
              ))}
            </Select>
          </div> */}
          <div>
            <Button type="primary" onClick={() => showModal({})}>
              新增
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
          scroll={{ y: 'calc(100vh - 320px)', x: 1000 }}
        />
        {isModalVisible && (
          <OutStorageModal
            items={items}
            selectProject={selectProject}
            isModalVisible={true}
            data={itemData}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
            productList={productList}
          />
        )}
      </div>
    </App>
  )
}

export default OutStorage
