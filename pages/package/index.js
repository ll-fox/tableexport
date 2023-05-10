import React, { useRef, useState, useEffect, useContext } from 'react'
import {
  Table,
  Input,
  Button,
  Space,
  Tooltip,
  Tag,
  Select,
} from 'antd'
import Highlighter from 'react-highlight-words'
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import MyContext from '../../lib/context'
import App from '../components/Layout/index'
import style from './index.module.css'
import PackageModal from '../components/PackageModal'
import {
  fetchPackage,
} from '../api/package'
const { Option } = Select

const Package = () => {
  const { selectProject } = useContext(MyContext)
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [itemData, setItemData] = useState({})
  const [loading, setLoading] = useState(false)
  const searchInput = useRef(null)

  useEffect(() => {
    fetchData()
  }, [selectProject])


  const fetchData = () => {
    setLoading(true)
    fetchPackage(selectProject).then((res) => {
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
      dataIndex: 'date',
      key: 'date',
      width: 100,
      fixed: 'left',
      sorter: {
        compare: (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        // multiple: 3
      }
    },
    {
      title: '包装名称',
      dataIndex: 'packageName',
      width: 150,
      key: 'packageName',
      render: (val) => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      )
    },
    {
      title: '规格（斤）',
      dataIndex: 'specification',
      width: 100,
      key: 'specification'
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: 50,
      key: 'amount'
    },
    {
      title: '库存',
      dataIndex: 'inventory',
      width: 50,
      key: 'inventory'
    },
    {
      title: '金额/元',
      dataIndex: 'packagePrice',
      width: 100,
      sorter: {
        compare: (a, b) => a.packagePrice - b.packagePrice
        // multiple: 3
      },
      key: 'packagePrice'
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
      width: 100,
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
      width: 70,
      render: (val, re) => (
        <>
          <a onClick={() => showModal(re)}>编辑</a>
        </>
      )
    },
    {
      title: '新增',
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      width: 50,
      render: (val, re) => (
        <>
          <a onClick={() => showModal(re)}>增加</a>
        </>
      )
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

  return (
    <App tab={'package'}>
      <div>
        <div className={style.top}>
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
          </div>
        </div>
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
        {isModalVisible && (
          <PackageModal
            isModalVisible={true}
            selectProject={selectProject}
            data={itemData}
            handleCancel={handleCancel}
            handleReplyFinish={handleReplyFinish}
          />
        )}
      </div>
    </App>
  )
}

export default Package
