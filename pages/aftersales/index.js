import React, { useRef, useState, useEffect } from 'react'
import { Table, Input, Button, Space, Tooltip, Tag } from 'antd'
import Highlighter from 'react-highlight-words'
import ExportJsonExcel from 'js-export-excel'
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import App from '../components/Layout/index'
import style from './index.module.css'
import AfterModal from '../components/AfterModal'
import ReplyModal from '../components/AfterModal/reply'
import { fetchTable } from '../api/aftersales'

const Home = () => {
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isReplyModalVisible, setReplyIsModalVisible] = useState(false)
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
  }, [])

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
      title: '??????????????????',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      fixed: 'left',
      ...getColumnSearchProps('date')
    },
    {
      title: '????????????',
      dataIndex: 'platform',
      width: 110,
      key: 'platform'
    },
    {
      title: '????????????',
      dataIndex: 'expressage',
      width: 100,
      key: 'expressage'
    },
    // {
    //   title: '???????????????',
    //   dataIndex: 'platformOrderNumber',
    //   key: 'platformOrderNumber',
    //   width: 180,
    //   ...getColumnSearchProps('platformOrderNumber')
    // },
    {
      title: '????????????',
      dataIndex: 'odd',
      key: 'odd',
      width: 180,
      ...getColumnSearchProps('odd')
    },
    {
      title: '?????????',
      dataIndex: 'username',
      width: 100,
      key: 'username',
      ...getColumnSearchProps('username')
    },
    {
      title: '??????',
      dataIndex: 'phone',
      width: 140,
      key: 'phone'
    },
    // {
    //   title: '??????',
    //   dataIndex: 'address',
    //   key: 'address',
    //   width: 180,
    //   ellipsis: true,
    //   render: (val) => (
    //     <Tooltip placement="topLeft" title={val}>
    //       {val}
    //     </Tooltip>
    //   )
    // },
    {
      title: '????????????',
      dataIndex: 'reason',
      width: 300,
      key: 'reason',
      render: (val, re) => (
        <div>
          <span> {val}</span>
          <a
            style={{ marginLeft: '3px', fontWeight: '700' }}
            onClick={() => showReplyModal(re)}
          >
            ??????
          </a>
        </div>
      )
    },
    {
      title: '???????????????',
      dataIndex: 'dealwith',
      width: 120,
      key: 'dealwith',
      render: (val) => (
        <Tag
          icon={
            val === '???' ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
          color={val === '???' ? '#55acee' : '#cd201f'}
        >
          {val}
        </Tag>
      )
    },
    {
      title: '????????????',
      dataIndex: 'result',
      width: 130,
      ellipsis: true,
      key: 'result',
      render: (val) => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      )
    },
    // {
    //   title: '????????????',
    //   dataIndex: 'price',
    //   width: 100,
    //   key: 'price'
    // },
    {
      title: '??????',
      dataIndex: '',
      width: 80,
      key: 'x',
      fixed: 'right',
      render: (val, re) => <a onClick={() => showModal(re)}>??????</a>
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
    setLoading(true)
    fetchTable().then((res) => {
      setData(res)
      setChangeData(res)
      setLoading(false)
    })
  }

  const showReplyModal = (re) => {
    setItemData(re)
    setReplyIsModalVisible(true)
  }

  const handleReplyCancel = () => {
    setReplyIsModalVisible(false)
  }

  const handleReplyFinish = () => {
    setReplyIsModalVisible(false)
    setLoading(true)
    fetchTable().then((res) => {
      setData(res)
      setChangeData(res)
      setLoading(false)
    })
  }

  const onChange = (pagination, filters, sorter, extra) => {
    setChangeData(extra.currentDataSource)
  }

  const exportTable = () => {
    let sheetFilter = [
      'date',
      'platform',
      'expressage',
      'platformOrderNumber',
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
    option.fileName = '????????????'
    option.datas = [
      {
        sheetData: changeData,
        sheetName: '????????????',
        sheetFilter: sheetFilter,
        sheetHeader: [
          '??????????????????',
          '????????????',
          '????????????',
          '???????????????',
          '????????????',
          '?????????',
          '??????',
          '??????',
          '????????????',
          '???????????????',
          '????????????',
          '????????????'
        ],
        columnWidths: [5, 5, 5, 5, 5, 5, 5, 5, 10]
      }
    ]
    const toExcel = new ExportJsonExcel(option) //new
    toExcel.saveExcel() //??????
  }

  return (
    <App tab={'aftersales'}>
      <div>
        <div className={style.top}>
          <Button type="primary" onClick={() => showModal({})}>
            ??????
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
          scroll={{ y: 'calc(100vh - 300px)', x: 1500 }}
          onChange={onChange}
        />
        {isModalVisible && (
          <AfterModal
            isModalVisible={true}
            data={itemData}
            handleCancel={handleCancel}
            handleFinish={handleFinish}
          />
        )}
        {isReplyModalVisible && (
          <ReplyModal
            handleReplyFinish={handleReplyFinish}
            isModalVisible={true}
            data={itemData}
            handleCancel={handleReplyCancel}
          />
        )}
      </div>
    </App>
  )
}

export default Home
