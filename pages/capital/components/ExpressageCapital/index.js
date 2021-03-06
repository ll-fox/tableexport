import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Tooltip, Form, Image } from 'antd'
import Highlighter from 'react-highlight-words'
import ExportJsonExcel from 'js-export-excel'
import { SearchOutlined } from '@ant-design/icons'
import style from './index.module.css'
import ExpressageCapitalModal from './ExpressageCapitalModal'
import { fetchCapital } from '../../../api/capital'
import { fetchExpressage } from '../../../api/expressage'

const ExpressageCapital = () => {
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [changeData, setChangeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [expressageList, setExpressageList] = useState([])

  const searchInput = useRef(null)
  useEffect(() => {
    setLoading(true)
    fetchExpressage().then((res) => {
      setExpressageList(res)
    })
    fetchCapital().then((res) => {
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
      title: '??????',
      dataIndex: 'date',
      key: 'date',
      width: 130,
      fixed: 'left',
      ...getColumnSearchProps('date')
    },
    {
      title: '????????????',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      ...getColumnSearchProps('id')
    },
    {
      title: '????????????',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: '????????????',
      dataIndex: 'expressage',
      width: 130,
      key: 'expressage'
    },
    {
      title: '?????????',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ...getColumnSearchProps('name')
    },
    {
      title: '??????????????????',
      dataIndex: 'payAcountName',
      key: 'payAcountName'
    },
    {
      title: '????????????',
      dataIndex: 'payAcount',
      key: 'payAcount'
    },
    {
      title: '????????????',
      dataIndex: 'payPrice',
      sorter: {
        compare: (a, b) => a.price - b.price
        // multiple: 3
      },
      key: 'payPrice'
    },
    {
      title: '?????????',
      dataIndex: 'payee',
      key: 'payee',
      width: 130
    },
    {
      title: '??????????????????',
      dataIndex: 'payeeName',
      key: 'payeeName'
    },
    {
      title: '????????????',
      dataIndex: 'payeeAcount',
      key: 'payeeAcount'
    },
    {
      title: '??????',
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
      title: '????????????',
      dataIndex: 'material',
      key: 'material',
      ellipsis: true,
      width: 150,
      render: (val) => <Image alt="" width={50} src={val} />
    },
    {
      title: '??????',
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      render: (val, re) => <a onClick={() => showModal(re)}>??????</a>
    }
  ]

  const showModal = (re) => {
    Promise.resolve()
      .then(() => {
        setItemData(() => re)
      })
      .then(() => {
        setIsModalVisible(() => true)
      })
  }

  const handleCancel = () => {
    Promise.resolve()
      .then(() => {
        setItemData(() => {})
      })
      .then(() => {
        setIsModalVisible(() => false)
      })
  }

  const onChange = (pagination, filters, sorter, extra) => {
    setChangeData(extra.currentDataSource)
  }

  const exportTable = () => {
    let sheetFilter = [
      'date',
      'id',
      'projectName',
      'expressage',
      'name',
      'payAcountName',
      'payAcount',
      'payPrice',
      'payee',
      'payeeName',
      'payeeAcount',
      'remark',
      'material'
    ]
    let option = {}
    option.fileName = '?????????????????????'
    option.datas = [
      {
        sheetData: changeData,
        sheetName: '?????????????????????',
        sheetFilter: sheetFilter,
        sheetHeader: [
          '??????',
          '????????????',
          '????????????',
          '????????????',
          '?????????',
          '??????????????????',
          '????????????',
          '????????????',
          '?????????',
          '??????????????????',
          '????????????',
          '??????',
          '????????????'
        ],
        columnWidths: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10]
      }
    ]
    const toExcel = new ExportJsonExcel(option) //new
    toExcel.saveExcel() //??????
  }

  return (
    <div>
      <div className={style.top}>
        <Button type="primary" onClick={() => showModal({})}>
          ??????+
        </Button>
        <Button type="primary" onClick={exportTable} danger ghost>
          ??????
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
          showTotal: (total) => `??? ${total} ???`
        }}
        scroll={{ y: 'calc(100vh - 320px)', x: 2200 }}
        onChange={onChange}
      />
      {isModalVisible && (
        <ExpressageCapitalModal
          isModalVisible={true}
          data={itemData}
          expressageList={expressageList}
          handleCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default ExpressageCapital
