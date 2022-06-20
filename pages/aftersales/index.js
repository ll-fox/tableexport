import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space } from 'antd'
import Highlighter from 'react-highlight-words'
import ExportJsonExcel from 'js-export-excel'
import { SearchOutlined } from '@ant-design/icons'
import App from '../components/Layout/index'
import style from './index.module.css'
import AfterModal from '../components/AfterModal'
import { fetchTable } from '../api/aftersales'

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
      title: '售后反馈日期',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date')
    },
    {
      title: '平台名称',
      dataIndex: 'platform',
      key: 'platform'
    },
    {
      title: '快递公司',
      dataIndex: 'expressage',
      key: 'expressage'
    },
    {
      title: '快递单号',
      dataIndex: 'odd',
      key: 'odd',
      ...getColumnSearchProps('odd')
    },
    {
      title: '收件人',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps('username')
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '售后原因',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: '是否已处理',
      dataIndex: 'dealwith',
      key: 'dealwith'
    },
    {
      title: '处理结果',
      dataIndex: 'result',
      key: 'result'
    },
    {
      title: '售后金额',
      dataIndex: 'price',
      key: 'price'
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

  const onChange = (pagination, filters, sorter, extra) => {
    setChangeData(extra.currentDataSource)
  }

  const exportTable = () => {
    let sheetFilter = [
      'date',
      'platform',
      'expressage',
      'odd',
      'username',
      'phone',
      'address',
      'reason',
      'dealwith',
      'result',
      'price'
    ]
    let option = {}
    option.fileName = '售后反馈'
    option.datas = [
      {
        sheetData: changeData,
        sheetName: '售后反馈',
        sheetFilter: sheetFilter,
        sheetHeader: [
          '售后反馈日期',
          '平台名称',
          '快递公司',
          '快递单号',
          '收件人',
          '电话',
          '地址',
          '售后原因',
          '是否已处理',
          '处理结果',
          '售后金额'
        ],
        columnWidths: [5, 5, 5, 5, 5, 5, 5, 10]
      }
    ]
    const toExcel = new ExportJsonExcel(option) //new
    toExcel.saveExcel() //保存
  }

  return (
    <App tab={'aftersales'}>
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
        <AfterModal
          isModalVisible={isModalVisible}
          data={itemData}
          handleCancel={handleCancel}
          handleOk={handleOk}
        />
      </div>
    </App>
  )
}

export default Home
