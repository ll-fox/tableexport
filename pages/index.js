import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Tooltip, Form, DatePicker } from 'antd'
import Highlighter from 'react-highlight-words'
import ExportJsonExcel from 'js-export-excel'
import { SearchOutlined } from '@ant-design/icons'
import App from './components/Layout/index'
import style from '../styles/Home.module.css'
import TableFrom from './components/TableForm'
import { fetchTable } from './api/home'

const Home = () => {
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [changeData, setChangeData] = useState([])
  const [loading, setLoading] = useState(false)

  const searchInput = useRef(null)
  useEffect(() => {
    setLoading(true)
    fetchTable().then((res) => {
      setData(res)
      setChangeData(res)
      setLoading(false)
    })
  }, [isModalVisible])

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
      title: '送货日期',
      dataIndex: 'date',
      key: 'date',
      width: 130,
      ...getColumnSearchProps('date')
    },
    {
      title: '类别',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      width: 200,
      key: 'supplierName'
    },
    {
      title: '规格名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ...getColumnSearchProps('name')
    },
    {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      sorter: {
        compare: (a, b) => a.num - b.num
        // multiple: 3
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice'
    },
    {
      title: '金额/元',
      dataIndex: 'price',
      sorter: {
        compare: (a, b) => a.price - b.price
        // multiple: 3
      },
      key: 'price'
    },
    {
      title: '付款日期',
      dataIndex: 'rePriceDate',
      key: 'rePriceDate',
      width: 130
    },
    {
      title: '付款金额',
      dataIndex: 'rePrice',
      key: 'rePrice'
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

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onChange = (pagination, filters, sorter, extra) => {
    setChangeData(extra.currentDataSource)
  }

  const exportTable = () => {
    let sheetFilter = [
      'date',
      'type',
      'supplierName',
      'name',
      'num',
      'unitPrice',
      'price',
      'rePriceDate',
      'rePrice',
      'remark'
    ]
    let option = {}
    option.fileName = '出货单'
    option.datas = [
      {
        sheetData: changeData,
        sheetName: '出货单',
        sheetFilter: sheetFilter,
        sheetHeader: [
          '送货日期',
          '类别',
          '供应商名称',
          '规格名称',
          '数量',
          '单价',
          '金额/元',
          '付款日期',
          '付款金额',
          '备注'
        ],
        columnWidths: [5, 5, 5, 5, 5, 5, 5, 10]
      }
    ]
    const toExcel = new ExportJsonExcel(option) //new
    toExcel.saveExcel() //保存
  }

  return (
    <App tab={'home'}>
      <div>
        <div className={style.top}>
          <Button type="primary" onClick={() => showModal({})}>
            新增
          </Button>
          <Button type="primary" onClick={exportTable} danger ghost>
            导出
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ y: 'calc(100vh - 320px)' }}
          onChange={onChange}
        />
        {isModalVisible && (
          <TableFrom
            isModalVisible={true}
            data={itemData}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </App>
  )
}

export default Home
