import React, { useRef, useState, useEffect } from 'react'
import {
  Table,
  Input,
  Button,
  Space,
  Tooltip,
  List,
  Tag,
  Select,
  Typography,
  Divider
} from 'antd'
import Highlighter from 'react-highlight-words'
import ExportJsonExcel from 'js-export-excel'
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import App from './components/Layout/index'
import style from '../styles/Home.module.css'
import ProductStorageModal from './components/ProductStorageModal'
import {
  fetchProductStorage,
  fetchProductSupplier,
  addProductSupplier
} from './api/productStorage'
const { Option } = Select

const Home = () => {
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [changeData, setChangeData] = useState([])
  const [name, setName] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const searchInput = useRef(null)

  useEffect(() => {
    fetchPlat()
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchPlat = () => {
    fetchProductSupplier().then((res) => {
      setItems(res)
    })
  }

  const fetchData = (val) => {
    val = val === '所有供应商' ? '' : val
    setLoading(true)
    fetchProductStorage(val || '').then((res) => {
      setData(res)
      setChangeData(res)
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
      dataIndex: 'date',
      key: 'date',
      width: 130,
      fixed: 'left',
      sorter: {
        compare: (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        // multiple: 3
      }
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      width: 200,
      key: 'supplierName'
    },
    {
      title: '产品名称',
      dataIndex: 'productType',
      width: 200,
      key: 'productType',
      render: (val, re) => (
        <List
          itemLayout="horizontal"
          dataSource={re.total}
          size={'small'}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '3px 0'
              }}
            >
              {item.productType}
            </List.Item>
          )}
        />
      )
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 150,
      render: (val, re) => (
        <List
          itemLayout="horizontal"
          dataSource={re.total}
          size={'small'}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '3px 0'
              }}
            >
              {item.specification}
            </List.Item>
          )}
        />
      )
    },
    {
      title: '预计使用规格',
      dataIndex: 'planSpecification',
      key: 'planSpecification',
      width: 150,
      render: (val, re) => (
        <List
          itemLayout="horizontal"
          dataSource={re.total}
          size={'small'}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '3px 0'
              }}
            >
              {item.planSpecification}
            </List.Item>
          )}
        />
      )
    },
    {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      width: 100,
      render: (val, re) => (
        <List
          itemLayout="horizontal"
          dataSource={re.total}
          size={'small'}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '3px 0'
              }}
            >
              {item.num}
            </List.Item>
          )}
        />
      )
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      key: 'unitPrice',
      render: (val, re) => (
        <List
          itemLayout="horizontal"
          dataSource={re.total}
          size={'small'}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '3px 0'
              }}
            >
              {item.unitPrice}
            </List.Item>
          )}
        />
      )
    },
    {
      title: '金额/元',
      dataIndex: 'price',
      width: 150,
      sorter: {
        compare: (a, b) => a.price - b.price
        // multiple: 3
      },
      key: 'price'
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
      title: '进库审核人',
      dataIndex: 'auditor',
      key: 'auditor',
      width: 100,
      ...getColumnSearchProps('auditor')
    },
    {
      title: '付款审核人',
      dataIndex: 'payAuditor',
      key: 'payAuditor',
      width: 100,
      ...getColumnSearchProps('payAuditor')
    },
    {
      title: '付款方式',
      dataIndex: 'payWay',
      key: 'payWay',
      width: 110,
      render: (val) => (
        <Tag
          icon={
            val === '现结' ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
          color={val === '现结' ? '#55acee' : '#cd201f'}
        >
          {val}
        </Tag>
      )
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
      title: '证明材料',
      dataIndex: 'material',
      key: 'material',
      ellipsis: true,
      width: 150,
      render: (val) =>
        val.map((item, index) => (
          <a target="_blank" key={index} href={item} rel="noreferrer">
            {item}
          </a>
        ))
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      width: 90,
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

  const handleReplyFinish = () => {
    setIsModalVisible(false)
    fetchData()
  }

  const onChange = (pagination, filters, sorter, extra) => {
    setChangeData(extra.currentDataSource)
  }

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const addItem = (e) => {
    e.preventDefault()
    if (name) {
      addProductSupplier(name)
      const obj = {}
      obj['name'] = name
      setItems([...items, obj])
      setName('')
      fetchPlat()
    }
  }

  const exportTable = () => {
    let sheetFilter = [
      'date',
      'supplierName',
      'productType',
      'specification',
      'planSpecification',
      'num',
      'unitPrice',
      'price',
      'remark',
      'auditor',
      'payAuditor',
      'payWay',
      'pay',
      'total',
      'material'
    ]
    let option = {}
    option.fileName = '原料进库'
    option.datas = [
      {
        sheetData: changeData,
        sheetName: '原料进库',
        sheetFilter: sheetFilter,
        sheetHeader: [
          '日期',
          '供应商名称',
          '产品名称',
          '规格',
          '预计使用规格',
          '数量',
          '单价',
          '金额/元',
          '备注',
          '进库审核人',
          '付款审核人',
          '付款方式',
          '是否付款',
          '汇总',
          '证明材料'
        ],
        columnWidths: [5, 5, 5, 5, 5, 5, 5, 10, 5, 5, 10, 5, 5]
      }
    ]
    const toExcel = new ExportJsonExcel(option) //new
    toExcel.saveExcel() //保存
  }

  return (
    <App tab={'home'}>
      <div>
        <div className={style.top}>
          <div>
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
          </div>
          <div>
            <Button
              style={{
                marginRight: '20px'
              }}
              type="primary"
              onClick={() => showModal({})}
            >
              新增
            </Button>
            <Button type="primary" onClick={exportTable} danger ghost>
              导出
            </Button>
          </div>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ y: 'calc(100vh - 320px)', x: '2500' }}
          onChange={onChange}
        />
        {isModalVisible && (
          <ProductStorageModal
            items={items}
            isModalVisible={true}
            data={itemData}
            handleCancel={handleCancel}
            handleReplyFinish={handleReplyFinish}
          />
        )}
      </div>
    </App>
  )
}

export default Home
